import { createGroup } from '~/features/groups';

export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event);

  const body = await readBody(event);
  const name = typeof body?.name === 'string' ? body.name : '';

  const result = await createGroup(user.id, { name });
  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: result.errorMsg });
  }

  setResponseStatus(event, 201);
  return result.group;
});
