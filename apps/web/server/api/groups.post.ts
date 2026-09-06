import { z } from 'zod';
import { createGroup } from '~/features/groups';

const createGroupSchema = z.object({
  name: z.string().trim().min(1, 'O nome do grupo é obrigatório.'),
});

export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event);
  const input = await parseBody(event, createGroupSchema);
  const group = await createGroup(user.id, input);

  setResponseStatus(event, 201);
  return group;
});
