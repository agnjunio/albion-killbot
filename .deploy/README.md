# Deploy

This app deploys itself via GitHub Actions — there is no separate infra repo.
Production config lives under `.deploy/production/`; a future `.deploy/staging/`
would follow the same shape.

- `.github/workflows/deploy-production.yml` doesn't build anything itself — it
  rsyncs the compose files below to each host, writes `.env` from this repo's
  `production` GitHub Environment secrets, then runs `docker compose pull && up`.
- Nothing under `.deploy/` should ever contain a real credential. Secrets are
  managed in **Settings → Environments → production**, injected at deploy time,
  never committed.
- `api`, `crawler`, and `bot` each run on their own VPS (see the `SSH_HOST_*`
  variables in the `production` environment). The four bot shards share one
  compose file — the shard number and hostname come from the deploy workflow's
  matrix, not from separate files.
- The dashboard (static site) deploys separately via
  `.github/workflows/dashboard-release.yml` — different shape (rsync a build
  output, no compose), left as-is.
