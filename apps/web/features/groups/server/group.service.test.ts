import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { eq, useDb } from '~/lib/db/client';
import { groups, users } from '~/lib/db/schema';
import { useSupabaseAdmin } from '~/lib/supabase/server';
import { createGroup } from './group.service';

describe('createGroup', () => {
  let ownerId: string;

  beforeEach(async () => {
    ownerId = await createFixtureUser();
  });

  afterEach(async () => {
    await useSupabaseAdmin().auth.admin.deleteUser(ownerId);
  });

  it('creates the group and registers the creator as OWNER', async () => {
    const group = await createGroup(ownerId, { name: 'Family' });

    try {
      const groupRow = await useDb().query.groups.findFirst({
        where: (g, { eq }) => eq(g.id, group.id),
      });
      expect(groupRow?.name).toBe('Family');

      const membershipRow = await useDb().query.groupMemberships.findFirst({
        where: (m, { and, eq }) =>
          and(eq(m.groupId, group.id), eq(m.userId, ownerId)),
      });
      expect(membershipRow?.role).toBe('OWNER');
    } finally {
      await useDb().delete(groups).where(eq(groups.id, group.id));
    }
  });
});

async function createFixtureUser(): Promise<string> {
  const { data, error } = await useSupabaseAdmin().auth.admin.createUser({
    email: `test-${randomUUID()}@example.com`,
    password: randomUUID(),
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Failed to create fixture auth user: ${error?.message}`);
  }

  await useDb().insert(users).values({
    id: data.user.id,
    name: 'Test User',
    timezone: 'America/Sao_Paulo',
  });

  return data.user.id;
}
