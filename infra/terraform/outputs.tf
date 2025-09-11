output "api_url" {
  value = google_cloud_run_service.api.status[0].url
}
output "api_runtime_sa" {
  value = google_service_account.api_runtime.email
}
output "deployer_sa" {
  value = google_service_account.deployer.email
}

