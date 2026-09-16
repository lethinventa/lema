import type { Invitation } from '~/features/groups/types';
import { sql, useDb } from '~/lib/db/client';
import { invitations } from '~/lib/db/schema';

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
