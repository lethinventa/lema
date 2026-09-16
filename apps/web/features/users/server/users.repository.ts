import { useDb } from '~/lib/db/client';

export async function userExists(userId: string): Promise<boolean> {
  const user = await useDb().query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });
  return user !== undefined;
}
