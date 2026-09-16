import { setup } from '@nuxt/test-utils/e2e';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { randomUUID } from 'node:crypto';
import postgres from 'postgres';
import { requireEnv } from '~/config/env';
import { usersFactory } from '~/features/users';
import * as schema from '~/lib/db/schema';

/**
 * Boots the real Nitro server a route test hits over HTTP. Callers still
 * need `// @vitest-environment node` at the top of their own file — see
 * CLAUDE.md's route-test rule for why.
 */
export function setupRouteTest() {
  return setup({ server: true, browser: false });
}

// A route test file runs in the vitest process, outside the Nuxt app
// instance setup() spawns as a subprocess — useRuntimeConfig() (and
// anything built on it, like useDb()/useSupabaseAdmin()/useSupabase())
// isn't available here. These are the same clients, built from process.env
// directly instead.
export const db = drizzle(
  postgres(requireEnv('NUXT_DATABASE_URL', process.env.NUXT_DATABASE_URL)),
  { schema },
);
const supabaseAdmin = createClient(
  requireEnv('NUXT_PUBLIC_SUPABASE_URL', process.env.NUXT_PUBLIC_SUPABASE_URL),
  requireEnv(
    'NUXT_SUPABASE_SERVICE_ROLE_KEY',
    process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY,
  ),
);
const supabaseAnon = createClient(
  requireEnv('NUXT_PUBLIC_SUPABASE_URL', process.env.NUXT_PUBLIC_SUPABASE_URL),
  requireEnv(
    'NUXT_PUBLIC_SUPABASE_ANON_KEY',
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
);

export function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * public.users rows are FK-bound to a real auth.users row (Supabase Auth),
 * which drizzle-factory can't create — it only inserts into Drizzle-managed
 * tables. The auth user still needs the Supabase admin API; the factory
 * only takes over the public.users insert that follows it. Signing in
 * afterwards gets a real access token, since route tests authenticate the
 * same way the SPA does — an Authorization: Bearer header — rather than
 * calling a service function directly with a trusted userId.
 */
export async function createFixtureSession(): Promise<{
  userId: string;
  token: string;
}> {
  const email = `test-${randomUUID()}@example.com`;
  const password = randomUUID();
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Failed to create fixture auth user: ${error?.message}`);
  }

  await usersFactory(db).create({ id: data.user.id });

  const { data: signedIn, error: signInError } =
    await supabaseAnon.auth.signInWithPassword({ email, password });
  if (signInError || !signedIn.session) {
    throw new Error(`Failed to sign in fixture user: ${signInError?.message}`);
  }

  return { userId: data.user.id, token: signedIn.session.access_token };
}
