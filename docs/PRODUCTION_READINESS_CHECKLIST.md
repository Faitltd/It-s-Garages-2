# Its Garages – Production Readiness Checklist (Path A)

Priority order: do items in each section top-to-bottom unless noted. Category: [A]=Automated via CI/CD, [M]=Manual Configuration Required, [B]=Business Decision Needed.
Estimate key: ~15m, 1–2h, 2–4h, 1–2d (business days). Dependencies noted per task.
Region: us-central1. Cost optimization: Cloud Run min-instances=0; modest CPU/memory; scale-to-zero; use free tiers where possible.

## 1) Third-Party Service Setup and API Keys

1. Stripe account and keys [M, 1–2h]
   - Obtain: dashboard.stripe.com → Developers → API keys (Publishable + Secret)
   - Webhook: add endpoint https://<CloudRunURL>/webhooks/stripe; copy Webhook Signing Secret
   - Verification: Business verification (KYB), domain and branding optional; enable live mode when ready
   - Storage: Google Secret Manager (GSM): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET; Publishable key in frontend .env at build-time
   - Dependencies: GCP project, Cloud Run URL (for webhook), GSM enabled

2. Amazon SES (replacing SendGrid) [M, 1–2d]
   - Obtain: aws.amazon.com/ses → verify domain/sender; request out-of-sandbox (production access)
   - Credentials: create SMTP credentials (username/password) or use AWS SDK credentials
   - Verification: DNS records for domain (SPF, DKIM, DMARC), bounce/complaint SNS handling
   - Storage: GSM secrets: SES_SMTP_USERNAME, SES_SMTP_PASSWORD or AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY; SES_REGION
   - Note: Current code uses SendGrid. Plan task to switch API to SES (see Section 8).

3. Google Cloud APIs [M, 30–60m]
   - Address Validation API key: console.cloud.google.com → APIs & Services → Credentials
   - Firebase config keys: Firebase console → Project settings → Web app config (public)
   - Storage: GSM: ADDRESS_VALIDATION_API_KEY; Frontend uses NEXT_PUBLIC_* Firebase config vars

4. Social Authentication for Firebase Auth (Google & Facebook) [M, 1–2h]
   - Google OAuth: console.cloud.google.com → Credentials → OAuth Client ID/Secret
   - Facebook App: developers.facebook.com → App ID/Secret
   - Verification: Set Authorized redirect URIs/domains per Firebase docs
   - Storage: In Firebase console providers; secrets not needed in backend; frontend uses provider config via Firebase

5. Additional credentials (as needed) [B/M, 30–60m]
   - Error reporting (Sentry) or Analytics: decide tool; store DSN in GSM if used

## 2) Google Cloud Platform Infrastructure Deployment

1. Project & Billing [M, 15–30m]
   - gcloud: gcloud projects create <PROJECT_ID>; link billing via console/billing CLI

2. Enable APIs [M, 5–10m]
   - gcloud services enable firestore.googleapis.com storage.googleapis.com run.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com addressvalidation.googleapis.com

3. Service Accounts & IAM [M, 15–30m]
   - SA: api-runtime (roles/datastore.user, roles/storage.objectAdmin, roles/secretmanager.secretAccessor)
   - SA: cloud-run-deployer (roles/run.admin, roles/iam.serviceAccountUser)

4. Workload Identity Federation for GitHub Actions OIDC [M, 1–2h]
   - Create pool & provider; bind repo to provider; grant deployer SA impersonation
   - Docs: https://github.com/google-github-actions/auth#setup

5. Artifact Registry [M, 5–10m]
   - gcloud artifacts repositories create its-garages-prod --repository-format=docker --location=us-central1

6. Cloud Run initial deploy [A/M, 15–30m]
   - via CI on main: builds/pushes image and deploys; canary 10% then manual promote

7. Firestore (Native mode) [M, 10–15m]
   - Console or gcloud; security rules TBD as needed; start with default locked-down

8. Cloud Storage bucket [M, 10–15m]
   - Create bucket (e.g., its-garages-prod-photos) with 30-day lifecycle delete rule

9. Google Secret Manager [M, 15–30m]
   - Create secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ADDRESS_VALIDATION_API_KEY, SES_* (or AWS_*), any future secrets

Terraform (preferred) [A]
- cd infra/terraform; terraform init; terraform apply -var-file=prod.tfvars

gcloud alternatives [M]
- Use infra/scripts/provision.sh (enables services, bucket, SAs, IAM) then complete WIF/AR/Run steps manually as above

Dependencies: Project→APIs→IAM→WIF→AR→Secrets→Cloud Run→Firestore/Storage.
Parallelizable: APIs enable + AR + bucket creation; sequential for WIF then CI deploy.
Rollback: Revoke roles, delete resources (with care), restore prior Cloud Run revision.

## 3) GitHub Repository Security and CI/CD Configuration

1. Actions secrets [M, 15–30m]
   - GCP_PROJECT_ID=your-prod-project
   - WORKLOAD_IDENTITY_PROVIDER=projects/.../locations/global/workloadIdentityPools/.../providers/...
   - DEPLOYER_SA_EMAIL=cloud-run-deployer@PROJECT_ID.iam.gserviceaccount.com
   - AR_REPO=us-central1-docker.pkg.dev/PROJECT_ID/its-garages-prod
   - (Optional) Additional NON-secret vars as needed

2. Branch protection for main [M, 10–15m]
   - Require PR review (≥1), status checks (ci, CodeQL), signed commits, linear history (optional), include admins

3. Required status checks [M, 10–15m]
   - ci (tests, scans), CodeQL

4. Dependabot [A]
   - Confirm .github/dependabot.yml present; monitor PRs; auto-merge patches optionally

5. Security policy and reporting [A]
   - .github/SECURITY.md present; consider private advisory workflow

Rollback: Relax branch rules temporarily if blocked; revert workflow by PR.

## 4) Firebase Configuration and Deployment

1. Link Firebase project to GCP project [M, 10–15m]
   - Firebase console → Add project (use existing GCP project)

2. Auth provider configuration [M, 30–60m]
   - Enable Google & Facebook providers; set app IDs/secrets and redirect URLs

3. Storage security rules deploy [A/M, 5–10m]
   - Pre-req: npm i -g firebase-tools; firebase login
   - Run: bash infra/scripts/deploy_storage_rules.sh <FIREBASE_PROJECT_ID>

4. Firestore security rules [B/M, 1–2h]
   - Start restrictive; add reads/writes only through backend or with rules modeling

5. Firebase SDK config for frontend [M, 10–15m]
   - Set NEXT_PUBLIC_FIREBASE_* envs (from Firebase console web app settings)

Rollback: Re-deploy previous rules; disable providers temporarily.

## 5) Production Domain and SSL Setup

1. Domain & DNS [B/M, 1–2h]
   - Register or use existing; manage DNS at registrar or Cloud DNS

2. Cloud Run domain mapping [M, 30–60m]
   - gcloud run domain-mappings create --service api --domain api.yourdomain.com --region us-central1
   - Verify DNS records; SSL cert auto-managed

3. Static assets/CDN [B/M, 1–2h]
   - Consider CDN (Cloud CDN/CloudFront) if needed; cache images; review CORS

4. CORS configuration [M, 15–30m]
   - API and Storage CORS to allow frontend origin(s) only

Rollback: Remove domain mapping; revert DNS; SSL auto-revokes on delete.

## 6) Monitoring, Logging, and Alerting Setup

1. Dashboards [M, 30–60m]
   - Cloud Monitoring: latency, error rate, req/sec, CPU/mem usage

2. Logging & retention [M, 30–60m]
   - Cloud Logging sinks/retention; consider 30–90 days

3. Error Reporting [M, 15–30m]
   - Enable and verify grouping; optional Sentry (B)

4. Uptime checks [M, 15–30m]
   - Monitor /healthz and key endpoints

5. Alerts [M, 30–60m]
   - Policies for 5xx rate, latency, CPU/mem, budget alerts

6. Cost monitoring [M, 30–60m]
   - Budgets + alerts at project level

Rollback: Disable noisy alerts; adjust thresholds.

## 7) Business Operations Configuration

1. Pricing & size options [B, 1–2d]
   - Define catalog and base prices by size; consider regional adjustments

2. Installer onboarding & assignment [B/M, 1–2d]
   - Define onboarding checklist; acceptance SLAs; email-based accept flow in MVP; portal later

3. Email templates via Amazon SES [B/M, 2–4h]
   - Create templates: order created, payment received, installer assigned, scheduled, completed

4. Support workflow [B, 2–4h]
   - Define contact methods, SLAs, escalation path

5. Fulfillment/tracking [B, 1–2d]
   - Decide carriers/vendors; update comms; integrate tracking links

6. Payments/refunds [B, 2–4h]
   - Define refund policy; implement Stripe refunds via dashboard/API later

Dependencies: Pricing before checkout; installer network before scheduling.
Rollback: Update templates/pricing; manual override where needed.

## 8) Security and Compliance Checklist

1. CI Security scans review [M, 30–60m]
   - Ensure ci, CodeQL, npm audit results clear or mitigated

2. Penetration testing [B, 1–2d]
   - Schedule external pentest before broad launch

3. Data privacy compliance [M/B, 2–4h]
   - Confirm 30-day photo deletion; honor deletion requests; privacy policy

4. PCI compliance [M, 1–2h]
   - Verify Stripe Checkout-only; no card data stored/processed

5. Backup/DR [M, 2–4h]
   - Confirm Firestore backups (daily); export policies; document RTO=1h/RPO=15m targets

6. Incident response plan [B/M, 2–4h]
   - Define on-call, runbooks, severity matrix, comms plan

Rollback: Revert problematic rules; disable risky endpoints; roll traffic back.

---

### Suggested Execution Order & Parallelism
1. GCP Project/APIs/IAM/WIF (Section 2.1–2.4) [M] – sequential
2. Artifact Registry + GSM (2.5, 2.9) [M] – parallel
3. Stripe + SES setup (1.1–1.2) [M] – parallel
4. Firebase linking & auth providers (4.1–4.2) [M] – parallel
5. Bucket + lifecycle + rules (2.8, 4.3) [M/A] – sequential
6. CI/CD secrets + branch protection (3.1–3.3) [M] – sequential
7. First CI deploy (2.6) [A] – sequential
8. Monitoring/alerts (6) [M] – parallel after first deploy
9. Business operations (7) [B] – parallel, ongoing

### Rollback Procedures (major changes)
- Cloud Run deploy: shift traffic to previous revision; redeploy prior image
- Firebase rules: redeploy prior rules version; restrict access temporarily
- IAM/WIF: remove bindings; disable provider; re-enable when fixed
- DNS/domain mapping: revert records; remove mapping
- Secrets: rotate GSM versions; update service to new versions

