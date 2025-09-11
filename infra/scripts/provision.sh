#!/usr/bin/env bash
set -euo pipefail
PROJECT_ID=${GCP_PROJECT_ID:?set GCP_PROJECT_ID}
REGION=${GCP_REGION:-us-central1}
BUCKET=${STORAGE_BUCKET:?set STORAGE_BUCKET}
REPO=${AR_REPO:?set AR_REPO} # e.g., repo name only

gcloud services enable firestore.googleapis.com storage.googleapis.com run.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com addressvalidation.googleapis.com --project "$PROJECT_ID"

gcloud artifacts repositories create "$REPO" --repository-format=docker --location="$REGION" --description="Its Garages containers" --project "$PROJECT_ID" || true

gsutil mb -l "$REGION" -p "$PROJECT_ID" "gs://$BUCKET" || true
gsutil lifecycle set - <<JSON gs://$BUCKET
{
  "rule": [ { "action": {"type": "Delete"}, "condition": {"age": 30} } ]
}
JSON

gcloud iam service-accounts create api-runtime --display-name="API Runtime" --project "$PROJECT_ID" || true
SA="api-runtime@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA" --role="roles/datastore.user"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA" --role="roles/storage.objectAdmin"
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:$SA" --role="roles/secretmanager.secretAccessor"

echo "Done. Configure OIDC and Cloud Run deploy via CI."

