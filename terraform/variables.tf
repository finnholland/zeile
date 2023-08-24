variable "name" {
  default = "fh-zeile"
}
variable "region" {
  default = "australia-southeast1" # change this & also the function region in functions/src/index.ts
}
variable "zone" {
  default = "australia-southeast1-a" # change this if changing above
}
variable "allow_rules" {
  default = "rules_version = '2';\n\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}"
}