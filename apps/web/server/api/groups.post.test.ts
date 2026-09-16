// @vitest-environment node
import { fetch, setup } from '@nuxt/test-utils/e2e';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { randomUUID } from 'node:crypto';
import postgres from 'postgres';
import { describe, expect, it } from 'vitest';
import { requireEnv } from '~/config/env';
import { usersFactory } from '~/features/users';
import * as schema from '~/lib/db/schema';

await setup({ server: true, browser: false });

// The route under test runs inside the real Nitro server setup() boots as a
// subprocess — it can use useDb()/useSupabaseAdmin() (lib/db/client.ts,
// lib/supabase/server.ts) normally, since those need a live Nuxt app
// instance. This test *file*, though, runs in the vitest process, which
// isn't part of that app instance, so useRuntimeConfig() (and anything
// built on it) isn't available here — build plain clients from process.env
// instead, same values, just not routed through useRuntimeConfig().
const db = drizzle(
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

describe('POST /api/groups', () => {
  it('returns 401 when unauthenticated', async () => {
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Family' }),
    });

    expect(res.status).toBe(401);
  });

  it('creates the group and registers the creator as OWNER', async () => {
    const owner = await createFixtureSession();

    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${owner.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Family' }),
    });
    expect(res.status).toBe(201);
    const group = await res.json();

    const groupRow = await db.query.groups.findFirst({
      where: (g, { eq }) => eq(g.id, group.id),
    });
    expect(groupRow?.name).toBe('Family');

    const membershipRow = await db.query.groupMemberships.findFirst({
      where: (m, { and, eq }) =>
        and(eq(m.groupId, group.id), eq(m.userId, owner.userId)),
    });
    expect(membershipRow?.role).toBe('OWNER');
  });
});

/**
 * public.users rows are FK-bound to a real auth.users row (Supabase Auth),
 * which drizzle-factory can't create — it only inserts into Drizzle-managed
 * tables. The auth user still needs the Supabase admin API; the factory
 * only takes over the public.users insert that follows it. Signing in
 * afterwards gets a real access token, since route tests authenticate the
 * same way the SPA does — an Authorization: Bearer header — rather than
 * calling a service function directly with a trusted userId.
 */
async function createFixtureSession(): Promise<{
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
