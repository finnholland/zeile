# Terraform configuration to set up providers by version.
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

# Configures the provider to use the resource block's specified project for quota checks.
provider "google-beta" {
  project = var.name
  zone    = var.zone
  region  = var.region
  user_project_override = true
}

provider "google-beta" {
  alias = "no_user_project_override"
  user_project_override = false
}

locals {
  allow_rules = "rules_version = '2';\n\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read: if true;\n      allow write: if 'token' in request.resource.data && request.resource.data.token == '${var.token}';\n    }\n  }\n}"
}

resource "google_project" "gcp_project" {
  provider = google-beta
  project_id = var.name
  name       = var.name
  labels = {
    "firebase" = "enabled"
  }
}

resource "google_project_service" "gcp_service" {
  provider = google-beta.no_user_project_override
  project  = google_project.gcp_project.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "firestore.googleapis.com",
    # Enabling the ServiceUsage API allows the new project to be quota checked from now on.
    "serviceusage.googleapis.com"
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false
}


# Enables Firebase services for the new project created above.
resource "google_firebase_project" "zeile_project" {
  provider = google-beta
  project = google_project.gcp_project.project_id
  depends_on = [ google_project_service.gcp_service ]
}

resource "google_firebase_web_app" "zeile_app" {
  provider = google-beta
  project = google_project.gcp_project.project_id
  display_name = var.name
  deletion_policy = "DELETE"

  depends_on = [google_firebase_project.zeile_project]
}

data "google_firebase_web_app_config" "zeile_config" {
  provider   = google-beta
  web_app_id = google_firebase_web_app.zeile_app.app_id
  project    = google_project.gcp_project.project_id
}

resource "google_firestore_database" "zeile_firestore" {
  project     = google_project.gcp_project.project_id
  name        = "(default)"
  location_id = var.region
  type = "FIRESTORE_NATIVE"
  depends_on = [ google_project_service.gcp_service ]
}

resource "google_firebaserules_release" "primary" {
  name         = "cloud.firestore"
  ruleset_name = "projects/${var.name}/rulesets/${google_firebaserules_ruleset.firestore.name}"
  project      = var.name

  lifecycle {
    replace_triggered_by = [
      google_firebaserules_ruleset.firestore
    ]
  }
}

resource "google_firebaserules_ruleset" "firestore" {
  source {
    files {
      content = local.allow_rules
      name    = "firestore.rules"
    }
  }

  project = var.name
  depends_on = [ google_firestore_database.zeile_firestore ]
}