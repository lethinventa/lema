import { z } from 'zod';
import { inviteMember } from '~/features/groups';

const inviteMemberSchema = z.object({
  userId: z.string().uuid('ID de usuário inválido.'),
});

export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event);
  // Route only matches with this segment present, so it's never undefined
  // in practice — same non-null rationale as insertGroupWithOwner's
  // createdGroup! (group.repository.ts).
  const groupId = getRouterParam(event, 'groupId')!;
  const input = await parseBody(event, inviteMemberSchema);

  const result = await inviteMember(user.id, groupId, input);
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.errorMsg });
  }

  setResponseStatus(event, 201);
  return result.invitation;
});
