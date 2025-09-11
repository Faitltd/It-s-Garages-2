variable "project_id" { type = string }
variable "region" { type = string  default = "us-central1" }
variable "bucket_name" { type = string }
variable "artifact_repo" { type = string }
variable "service_name" { type = string default = "api" }
variable "api_image" { type = string description = "Container image for API (Artifact Registry)" }

