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

## RabbitMQ: manual step after any volume wipe

`RABBITMQ_DEFAULT_USER`/`RABBITMQ_DEFAULT_PASS` (set from the `RABBITMQ_USER`/
`RABBITMQ_PASSWORD` secrets) only bootstrap RabbitMQ's *admin* user on first
boot. The actual app user — the one embedded in `AMQP_URL`, used by `crawler`
and every `bot` shard — is a **separate user that must be created manually**
via `rabbitmqctl` any time the `rabbitmq_data` volume is fresh (new host,
volume wiped, `docker compose down -v`). It is not created by any env var or
compose config.

If crawler/bots start logging `ACCESS_REFUSED` after a redeploy, this is why.
Fix: exec into the `rabbitmq` container and run
`rabbitmqctl add_user <user> <password>` +
`rabbitmqctl set_permissions -p albion-killbot <user> ".*" ".*" ".*"`,
using the exact username/password embedded in the `AMQP_URL` secret.
