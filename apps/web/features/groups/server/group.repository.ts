import { useDb } from '~/lib/db/client';
import { groupMemberships, groups } from '~/lib/db/schema';

export type Group = typeof groups.$inferSelect;

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
    const [createdGroup] = await tx.insert(groups).values({ name }).returning();
    if (!createdGroup) {
      throw new Error('Insert into groups returned no row.');
    }

    await tx.insert(groupMemberships).values({
      groupId: createdGroup.id,
      userId: ownerId,
      role: 'OWNER',
    });

    return createdGroup;
  });
}
