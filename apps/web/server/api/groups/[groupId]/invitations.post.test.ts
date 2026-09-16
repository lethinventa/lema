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

// See server/api/groups.post.test.ts for why these are built from
// process.env directly instead of useDb()/useSupabaseAdmin()/useSupabase().
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

describe('POST /api/groups/:groupId/invitations', () => {
  it('returns 401 when unauthenticated', async () => {
    const owner = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: owner.userId }),
    });

    expect(res.status).toBe(401);
  });

  it('registers a PENDING invitation when the inviter is a group member', async () => {
    const owner = await createFixtureSession();
    const invited = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body: JSON.stringify({ userId: invited.userId }),
    });

    expect(res.status).toBe(201);
    const invitationRows = await findInvitationRows(group.id, invited.userId);
    expect(invitationRows).toHaveLength(1);
    expect(invitationRows[0]).toMatchObject({
      groupId: group.id,
      invitedUserId: invited.userId,
      invitedByUserId: owner.userId,
      status: 'PENDING',
      acceptedAt: null,
    });
    expect(invitationRows[0]?.token).toBeTruthy();
  });

  it('rejects the invite when the inviter is not a group member', async () => {
    const owner = await createFixtureSession();
    const outsider = await createFixtureSession();
    const invited = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(outsider.token),
      body: JSON.stringify({ userId: invited.userId }),
    });

    expect(res.status).toBe(400);
    expect(await findInvitationRows(group.id, invited.userId)).toHaveLength(0);
  });

  it('rejects the invite when the invited person has no Lema account', async () => {
    const owner = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');
    const nonExistentUserId = randomUUID();

    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body: JSON.stringify({ userId: nonExistentUserId }),
    });

    expect(res.status).toBe(400);
    expect(await findInvitationRows(group.id, nonExistentUserId)).toHaveLength(
      0,
    );
  });

  it('rejects a duplicate PENDING invitation for the same person and group', async () => {
    const owner = await createFixtureSession();
    const invited = await createFixtureSession();
    const group = await createFixtureGroup(owner.token, 'Family');
    const body = JSON.stringify({ userId: invited.userId });

    await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body,
    });
    const res = await fetch(`/api/groups/${group.id}/invitations`, {
      method: 'POST',
      headers: authHeaders(owner.token),
      body,
    });

    expect(res.status).toBe(400);
    // Confirms the duplicate attempt didn't insert a second row alongside
    // the one from the first, successful call.
    expect(await findInvitationRows(group.id, invited.userId)).toHaveLength(1);
  });
});

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function findInvitationRows(groupId: string, invitedUserId: string) {
  return db.query.invitations.findMany({
    where: (i, { and, eq }) =>
      and(eq(i.groupId, groupId), eq(i.invitedUserId, invitedUserId)),
  });
}

async function createFixtureGroup(
  ownerToken: string,
  name: string,
): Promise<{ id: string }> {
  const res = await fetch('/api/groups', {
    method: 'POST',
    headers: authHeaders(ownerToken),
    body: JSON.stringify({ name }),
  });
  return res.json();
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
