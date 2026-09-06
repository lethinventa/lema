import type { Group } from './group.repository';
import { insertGroupWithOwner } from './group.repository';

/**
 * UC-GROUP-001: creates a group and registers the creator as its OWNER.
 *
 * UC-FIN-009 (financial onboarding, normally embedded in this flow) is
 * deliberately out of scope for this slice.
 */
export async function createGroup(
  ownerId: string,
  input: { name: string },
): Promise<
  { success: true; group: Group } | { success: false; errorMsg: string }
> {
  const name = input.name.trim();
  if (!name) {
    return { success: false, errorMsg: 'O nome do grupo é obrigatório.' };
  }

  const group = await insertGroupWithOwner(name, ownerId);
  return { success: true, group };
}
