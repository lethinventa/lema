import type { Group } from '~/features/groups/types';
import { insertGroupWithOwner } from './group.repository';

/**
 * UC-GROUP-001: creates a group and registers the creator as its OWNER.
 * Assumes `input` is already validated — see server/api/groups.post.ts —
 * the parameter type signature is the contract here, not a runtime check.
 *
 * UC-FIN-009 (financial onboarding, normally embedded in this flow) is
 * deliberately out of scope for this slice.
 */
export async function createGroup(
  ownerId: string,
  input: { name: string },
): Promise<Group> {
  return insertGroupWithOwner(input.name, ownerId);
}
