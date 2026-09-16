import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { usersFactory } from '~/features/users';
import { useDb } from '~/lib/db/client';
import { useSupabaseAdmin } from '~/lib/supabase/server';
import { createGroup, inviteMember } from './group.service';

describe('createGroup', () => {
  it('creates the group and registers the creator as OWNER', async () => {
    const ownerId = await createFixtureUser();
    const group = await createGroup(ownerId, { name: 'Family' });

    const groupRow = await useDb().query.groups.findFirst({
      where: (g, { eq }) => eq(g.id, group.id),
    });
    expect(groupRow?.name).toBe('Family');

    const membershipRow = await useDb().query.groupMemberships.findFirst({
      where: (m, { and, eq }) =>
        and(eq(m.groupId, group.id), eq(m.userId, ownerId)),
    });
    expect(membershipRow?.role).toBe('OWNER');
  });
});

describe('inviteMember', () => {
  it('registers a PENDING invitation when the inviter is a group member', async () => {
    const ownerId = await createFixtureUser();
    const invitedId = await createFixtureUser();
    const group = await createGroup(ownerId, { name: 'Family' });

    const result = await inviteMember(ownerId, group.id, {
      userId: invitedId,
    });

    expect(result.success).toBe(true);
    const invitationRows = await findInvitationRows(group.id, invitedId);
    expect(invitationRows).toHaveLength(1);
    expect(invitationRows[0]).toMatchObject({
      groupId: group.id,
      invitedUserId: invitedId,
      invitedByUserId: ownerId,
      status: 'PENDING',
      acceptedAt: null,
    });
    expect(invitationRows[0]?.token).toBeTruthy();
  });

  it('rejects the invite when the inviter is not a group member', async () => {
    const ownerId = await createFixtureUser();
    const outsiderId = await createFixtureUser();
    const invitedId = await createFixtureUser();
    const group = await createGroup(ownerId, { name: 'Family' });

    const result = await inviteMember(outsiderId, group.id, {
      userId: invitedId,
    });

    expect(result.success).toBe(false);
    expect(await findInvitationRows(group.id, invitedId)).toHaveLength(0);
  });

  it('rejects the invite when the invited person has no Lema account', async () => {
    const ownerId = await createFixtureUser();
    const group = await createGroup(ownerId, { name: 'Family' });
    const nonExistentUserId = randomUUID();

    const result = await inviteMember(ownerId, group.id, {
      userId: nonExistentUserId,
    });

    expect(result.success).toBe(false);
    expect(await findInvitationRows(group.id, nonExistentUserId)).toHaveLength(
      0,
    );
  });

  it('rejects a duplicate PENDING invitation for the same person and group', async () => {
    const ownerId = await createFixtureUser();
    const invitedId = await createFixtureUser();
    const group = await createGroup(ownerId, { name: 'Family' });

    await inviteMember(ownerId, group.id, { userId: invitedId });
    const result = await inviteMember(ownerId, group.id, {
      userId: invitedId,
    });

    expect(result.success).toBe(false);
    // Confirms the duplicate attempt didn't insert a second row alongside
    // the one from the first, successful call.
    expect(await findInvitationRows(group.id, invitedId)).toHaveLength(1);
  });
});

function findInvitationRows(groupId: string, invitedUserId: string) {
  return useDb().query.invitations.findMany({
    where: (i, { and, eq }) =>
      and(eq(i.groupId, groupId), eq(i.invitedUserId, invitedUserId)),
  });
}

/**
 * public.users rows are FK-bound to a real auth.users row (Supabase Auth),
 * which drizzle-factory can't create — it only inserts into Drizzle-managed
 * tables. The auth user still needs the Supabase admin API; the factory
 * only takes over the public.users insert that follows it.
 */
async function createFixtureUser(): Promise<string> {
  const { data, error } = await useSupabaseAdmin().auth.admin.createUser({
    email: `test-${randomUUID()}@example.com`,
    password: randomUUID(),
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Failed to create fixture auth user: ${error?.message}`);
  }

  await usersFactory(useDb()).create({ id: data.user.id });

  return data.user.id;
}
