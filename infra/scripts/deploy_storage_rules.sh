#!/usr/bin/env bash
set -euo pipefail
PROJECT_ID=${1:?Usage: $0 <GCP_FIREBASE_PROJECT_ID>}

# Requires Firebase CLI installed and logged in: npm i -g firebase-tools; firebase login
# This deploys ONLY Storage rules (no hosting, no firestore rules)
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
ROOT_DIR=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$ROOT_DIR"

firebase use "$PROJECT_ID" --project "$PROJECT_ID" || true
firebase deploy --only storage --project "$PROJECT_ID" --non-interactive --force

echo "Storage rules deployed to project: $PROJECT_ID"

