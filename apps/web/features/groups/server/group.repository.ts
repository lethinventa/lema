import type { Group, Invitation } from '~/features/groups/types';
import { sql, useDb } from '~/lib/db/client';
import { groupMemberships, groups, invitations } from '~/lib/db/schema';

/**
 * Inserts a group and its creator's OWNER membership as a single atomic
 * write — a group must never exist without at least one OWNER (PD-001),
 * even transiently under a partial failure.
 */
export async function insertGroupWithOwner(
  name: string,
  ownerId: string,
): Promise<Group> {
  const db = useDb();
  return db.transaction(async (tx) => {
    // A single-row `.values({ name })` insert (no ON CONFLICT) always
    // returns exactly one row; the `| undefined` here is only
    // noUncheckedIndexedAccess on the array destructure, not a real
    // possibility, so no runtime check is warranted.
    const [createdGroup] = await tx.insert(groups).values({ name }).returning();

    await tx.insert(groupMemberships).values({
      groupId: createdGroup!.id,
      userId: ownerId,
      role: 'OWNER',
    });

    return createdGroup!;
  });
}

export async function isGroupMember(
  groupId: string,
  userId: string,
): Promise<boolean> {
  const membership = await useDb().query.groupMemberships.findFirst({
    where: (m, { and, eq }) =>
      and(eq(m.groupId, groupId), eq(m.userId, userId)),
  });
  return membership !== undefined;
}

export async function userExists(userId: string): Promise<boolean> {
  const user = await useDb().query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });
  return user !== undefined;
}

/**
 * Returns undefined instead of inserting when a PENDING invitation already
 * exists for this group/invited-user pair — the partial unique index on
 * `invitations` (see lib/db/schema.ts) turns that into a conflict this
 * silently no-ops on, rather than a duplicate row.
 */
export async function insertInvitation(input: {
  groupId: string;
  invitedUserId: string;
  invitedByUserId: string;
  expiresAt: Date;
}): Promise<Invitation | undefined> {
  const [invitation] = await useDb()
    .insert(invitations)
    .values(input)
    .onConflictDoNothing({
      target: [invitations.groupId, invitations.invitedUserId],
      where: sql`${invitations.status} = 'PENDING'`,
    })
    .returning();

  return invitation;
}
