# It’s Garages 2 — Monorepo

This repository contains the SvelteKit web application for It’s Garages.

- App: apps/web (SvelteKit + Vite + Tailwind + mdsvex)
- Infra: infra (Dockerfile, Cloud Run env example)

## Prerequisites
- Node.js 20+
- PostgreSQL (local or hosted)
- Optional providers: Stripe, Resend/Postmark, Twilio, Google Maps

## Quick start (local dev)
1) Clone and install
```
npm install
```
2) Create environment file for the app
```
cp apps/web/.env.example apps/web/.env
```
3) Provide at least DATABASE_URL in apps/web/.env. Example (local Postgres):
```
DATABASE_URL=postgres://user:password@localhost:5432/its_garages
```
4) Generate and push database migrations
```
# from repo root
npm run --workspace apps/web migrate:generate
npm run --workspace apps/web migrate:push
```
5) Seed minimal data (adds 1–2 active technicians)
```
node apps/web/scripts/seed.js
```
6) Start the dev server
```
npm run --workspace apps/web dev
```
Open http://localhost:5173

## Environment variables
- See apps/web/.env.example (mirrors infra/cloudrun.env.example). Key variables:
  - DATABASE_URL (required)
  - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (optional; enables Checkout)
  - RESEND_API_KEY or POSTMARK_API_KEY (optional; email)
  - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (optional; SMS)
  - GOOGLE_MAPS_API_KEY (optional; Maps helpers)
  - SENTRY_DSN (optional)
  - BASE_URL (recommended in prod, e.g., https://itsgarages.com)
  - ADMIN_API_KEY (optional for admin-only endpoints)
  - RECAPTCHA_SECRET (recommended in prod for /api/leads captcha verification)

Notes:
- In production, /api/leads enforces captcha verification if `RECAPTCHA_SECRET` is set. In development it is mocked as "pass".
- Security headers and a basic per-instance rate limiter are applied in hooks.server.ts.

## Database
- ORM: drizzle-orm (Postgres)
- Migrations: drizzle-kit (configured via apps/web/src/lib/server/db/drizzle.config.ts)

Generate and push:
```
npm run --workspace apps/web migrate:generate
npm run --workspace apps/web migrate:push
```

Seed technicians (so availability API returns slots):
```
node apps/web/scripts/seed.js
```
The seed requires tables to exist (run migrations first).

## Testing
- Unit tests (Vitest):
```
npm run --workspace apps/web test
```
- E2E tests (Playwright) — requires dev server running on port 5173:
```
npm run --workspace apps/web test:e2e
```

## Build & Run
- Local build:
```
npm run --workspace apps/web build
node apps/web/build
```

## Docker & Cloud Run
- Build container (adapter-node):
```
docker build -t its-garages-web -f infra/Dockerfile .
```
- Run locally:
```
docker run -p 8080:8080 --env-file infra/cloudrun.env.example its-garages-web
```
- Deploy to Cloud Run (example):
  - Prepare a .env file with production values (see infra/cloudrun.env.example)
  - Using gcloud:
```
# Build with Cloud Build or local docker and push to a registry
# Then deploy (replace IMAGE and SERVICE names)
gcloud run deploy its-garages-web \
  --image=gcr.io/PROJECT_ID/its-garages-web:TAG \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars="$(paste -sd, infra/cloudrun.env.example)"
```

Tip: Prefer using a secrets manager for sensitive values.

## Project structure
```
/
  apps/web               # SvelteKit app (adapter-node)
    src/
      lib/server         # server-only services, db, pricing
      routes/api         # API endpoints
      routes             # UI routes
    tests/               # unit tests (vitest)
    e2e/                 # end-to-end tests (playwright)
  infra/                 # Dockerfile, env example for Cloud Run
```

## Operational notes
- CSP and security headers are enforced globally in hooks.server.ts
- /api/health probes DB connectivity
- Stripe checkout and webhooks are implemented; enable by setting STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET
- Cal.com booking webhook can create appointments when configured with CAL_WEBHOOK_SECRET

