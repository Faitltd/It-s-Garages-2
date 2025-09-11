# GCP Project Setup Checklist

1) Create/choose a GCP project and billing
2) Enable APIs:
   - firestore.googleapis.com
   - storage.googleapis.com
   - run.googleapis.com
   - secretmanager.googleapis.com
   - artifactregistry.googleapis.com
   - addressvalidation.googleapis.com
3) Create Artifact Registry repo (Docker) in us-central1
4) Create Cloud Run service (api) in us-central1 (or let CI deploy first)
5) Create Service Accounts (least privilege):
   - cloud-run-deployer (roles/run.admin, roles/iam.serviceAccountUser)
   - api-runtime (roles/datastore.user, roles/storage.objectAdmin, roles/secretmanager.secretAccessor)
6) Create Secret Manager secrets: STRIPE_SECRET_KEY, SENDGRID_API_KEY, ADDRESS_VALIDATION_API_KEY
7) Configure Workload Identity Federation (OIDC) for GitHub Actions
8) Set up Firestore (Native mode) and Storage bucket with 30-day lifecycle
9) Configure branch protections and required checks
10) Add GitHub repo secrets: GCP_PROJECT_ID, AR_REPO, WORKLOAD_IDENTITY_PROVIDER, DEPLOYER_SA_EMAIL

