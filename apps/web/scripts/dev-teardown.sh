#!/usr/bin/env bash
# Stops the local Supabase stack started by dev-setup.sh.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

npx supabase stop
