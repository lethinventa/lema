import type { Group, Invitation } from '~/features/groups/types';
import {
  insertGroupWithOwner,
  insertInvitation,
  isGroupMember,
  userExists,
} from './group.repository';

const INVITATION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

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

export type InviteMemberResult =
  | { success: true; invitation: Invitation }
  | { success: false; errorMsg: string };

/**
 * UC-GROUP-002: registers a PENDING invitation for `input.userId` to join
 * `groupId`. Any MEMBER (not just OWNER) can invite, per PD-001. Inviting
 * someone with no Lema account is not a valid operation (review decision on
 * PR #6) — narrows the UC's "person not registered yet" variation out of
 * this slice. Expiration is hardcoded to one week and there's no resend
 * mechanism yet — those are open questions in the UC, deliberately deferred
 * rather than decided here. Delivering the invite (email/WhatsApp/in-app
 * notification) is out of scope for this slice: the caller gets the
 * invitation back, including its shareable token, and is responsible for
 * the channel.
 */
export async function inviteMember(
  invitedByUserId: string,
  groupId: string,
  input: { userId: string },
): Promise<InviteMemberResult> {
  const isMember = await isGroupMember(groupId, invitedByUserId);
  if (!isMember) {
    return {
      success: false,
      errorMsg: 'Apenas membros do grupo podem convidar novas pessoas.',
    };
  }

  const invitedUserExists = await userExists(input.userId);
  if (!invitedUserExists) {
    return {
      success: false,
      errorMsg: 'Esta pessoa ainda não tem uma conta no Lema.',
    };
  }

  const invitation = await insertInvitation({
    groupId,
    invitedUserId: input.userId,
    invitedByUserId,
    expiresAt: new Date(Date.now() + INVITATION_EXPIRATION_MS),
  });
  if (!invitation) {
    return {
      success: false,
      errorMsg: 'Já existe um convite pendente para esta pessoa neste grupo.',
    };
  }

  return { success: true, invitation };
}
