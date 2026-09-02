#!/usr/bin/env bash
# Brings up a full local Supabase stack (Postgres + Auth + Storage) via
# Docker Compose (managed internally by the Supabase CLI, see
# docs/architecture/decisions/ADR-001-real-app-stack.md), then syncs its
# credentials into .env and applies the Drizzle schema.
#
# Safe to re-run: supabase start / db:generate / db:migrate are all
# idempotent.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install it first: https://docs.docker.com/get-docker/" >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon isn't running. Start Docker and try again." >&2
  exit 1
fi

if [ ! -f .env ]; then
  echo "No .env found — creating one from .env.example."
  cp .env.example .env
fi

echo "Starting local Supabase stack (Postgres + Auth + Storage)…"
npx supabase start >/dev/null

echo "Syncing local Supabase credentials into .env…"

# supabase status -o env prints one KEY="value" line per variable.
status="$(npx supabase status -o env)"

get_status_value() {
  echo "$status" | sed -n "s/^$1=\"\\(.*\\)\"\$/\\1/p"
}

set_env_var() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" .env; then
    sed -i.bak "s|^${key}=.*|${key}=${value}|" .env && rm -f .env.bak
  else
    echo "${key}=${value}" >>.env
  fi
}

set_env_var "NUXT_DATABASE_URL" "$(get_status_value DB_URL)"
set_env_var "NUXT_PUBLIC_SUPABASE_URL" "$(get_status_value API_URL)"
set_env_var "NUXT_PUBLIC_SUPABASE_ANON_KEY" "$(get_status_value ANON_KEY)"
set_env_var "NUXT_SUPABASE_SERVICE_ROLE_KEY" "$(get_status_value SERVICE_ROLE_KEY)"

echo "Applying database schema (lib/db/schema.ts)…"
pnpm db:generate
pnpm db:migrate

echo ""
echo "Local Supabase stack is up:"
echo "  API:      $(get_status_value API_URL)"
echo "  Studio:   $(get_status_value STUDIO_URL)"
echo "  Postgres: $(get_status_value DB_URL)"
echo "  Emails:   $(get_status_value MAILPIT_URL) (auth emails land here, not real inboxes)"
echo ""
echo "Run 'pnpm dev' to start the app, or 'pnpm dev:teardown' to stop the stack."
