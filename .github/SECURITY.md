# Security Policy

- Report vulnerabilities via GitHub Security Advisories or security@itsgarages.example
- Do not open public issues for sensitive reports.
- Secrets must not be committed. Use Google Secret Manager in cloud; .env only for local.
- CI enforces SAST/SCA and secret scanning; SBOMs are generated per build.

