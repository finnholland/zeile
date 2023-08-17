variable "name" {
  default = "fh-zeile-test"
}
variable "region" {
  default = "australia-southeast1"
}
variable "zone" {
  default = "australia-southeast1-a"
}
variable "billing_account" {
  default = "000000-222222-AAAAAA"
}
variable "allow_rules" {
  default = "rules_version = '2';\n\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}"
}