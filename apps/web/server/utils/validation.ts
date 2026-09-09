import type { H3Event } from 'h3';
import type { ZodType } from 'zod';

/**
 * Reads and validates an event's JSON body against a Zod schema, returning
 * the parsed (and possibly transformed, e.g. trimmed) data. Throws a 400 on
 * a malformed or invalid payload rather than returning a value — same
 * reasoning as requireAuthUser (server/utils/auth.ts): the request should
 * never have reached the route's business logic in this shape, so this is
 * an infrastructure/boundary failure, not a domain outcome to branch on.
 */
export async function parseBody<T>(
  event: H3Event,
  schema: ZodType<T>,
): Promise<T> {
  const body = await readBody(event);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message ?? 'Invalid payload.',
    });
  }

  return parsed.data;
}
