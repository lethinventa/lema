import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { useDb } from '~/lib/db/client';
import { useSupabaseAdmin } from '~/lib/supabase/server';
import { createGroup } from './group.service';
import { usersFactory } from './users.factory';

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
