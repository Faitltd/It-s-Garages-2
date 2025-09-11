resource "google_project_service" "services" {
  for_each = toset([
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "artifactregistry.googleapis.com",
    "addressvalidation.googleapis.com"
  ])
  service = each.key
}

resource "google_firestore_database" "default" {
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  depends_on  = [google_project_service.services]
}

resource "google_storage_bucket" "photos" {
  name                        = var.bucket_name
  location                    = var.region
  uniform_bucket_level_access = true
  lifecycle_rule {
    action { type = "Delete" }
    condition { age = 30 }
  }
}

resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = var.artifact_repo
  description   = "Its Garages containers"
  format        = "DOCKER"
}

resource "google_service_account" "api_runtime" {
  account_id   = "api-runtime"
  display_name = "API Runtime"
}

resource "google_service_account" "deployer" {
  account_id   = "cloud-run-deployer"
  display_name = "Cloud Run Deployer"
}

resource "google_project_iam_member" "api_firestore" {
  role   = "roles/datastore.user"
  member = "serviceAccount:${google_service_account.api_runtime.email}"
}
resource "google_project_iam_member" "api_storage" {
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.api_runtime.email}"
}
resource "google_project_iam_member" "api_secrets" {
  role   = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.api_runtime.email}"
}

resource "google_cloud_run_service" "api" {
  name     = var.service_name
  location = var.region
  template {
    spec {
      service_account_name = google_service_account.api_runtime.email
      containers {
        image = var.api_image
        env { name = "GCP_PROJECT_ID" value = var.project_id }
        env { name = "GCP_REGION" value = var.region }
        env { name = "PHOTO_RETENTION_DAYS" value = "30" }
      }
    }
  }
  traffics { percent = 100 latest_revision = true }
  depends_on = [google_project_service.services]
}

resource "google_secret_manager_secret" "stripe" { secret_id = "STRIPE_SECRET_KEY" replication { automatic = true } }
resource "google_secret_manager_secret" "sendgrid" { secret_id = "SENDGRID_API_KEY" replication { automatic = true } }
resource "google_secret_manager_secret" "addrval" { secret_id = "ADDRESS_VALIDATION_API_KEY" replication { automatic = true } }

