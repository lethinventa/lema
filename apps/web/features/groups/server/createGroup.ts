import { useDb } from '~/lib/db/client';
import { groupMemberships, groups } from '~/lib/db/schema';

/**
 * UC-GROUP-001: creates a group and registers the creator as its OWNER.
 * Transaction-wrapped so the two inserts succeed or fail together — a
 * group must never exist without at least one OWNER (PD-001), even
 * transiently under a partial failure.
 *
 * UC-FIN-009 (financial onboarding, normally embedded in this flow) is
 * deliberately out of scope for this slice.
 */
export async function createGroup(
  ownerId: string,
  input: { name: string },
): Promise<
  | { success: true; group: typeof groups.$inferSelect }
  | { success: false; errorMsg: string }
> {
  const name = input.name.trim();
  if (!name) {
    return { success: false, errorMsg: 'O nome do grupo é obrigatório.' };
  }

  const db = useDb();
  const group = await db.transaction(async (tx) => {
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

  return { success: true, group };
}
