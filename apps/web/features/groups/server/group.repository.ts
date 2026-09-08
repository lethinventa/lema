import { useDb } from '~/lib/db/client';
import { groupMemberships, groups } from '~/lib/db/schema';

export interface Group {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

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
