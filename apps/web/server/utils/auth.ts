import type { H3Event } from 'h3';
import type { User } from '~/lib/supabase/server';
import { useSupabaseAdmin } from '~/lib/supabase/server';

/**
 * Verifies the bearer token the SPA sends (supabase-js session lives in
 * localStorage, not a cookie — there's no other way for a Nitro route to
 * know who's calling) and returns the Supabase user it belongs to.
 *
 * Throws on a missing/invalid token rather than returning a value: an
 * unauthenticated request is an infrastructure access-control failure, not
 * a domain outcome a caller needs to branch on — same category as
 * requireEnv (config/env.ts) throwing on a missing env var, not the
 * "errors as values" category createGroup's validation falls into.
 */
export async function requireAuthUser(event: H3Event): Promise<User> {
  const header = getHeader(event, 'authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing bearer token.',
    });
  }

  const { data, error } = await useSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token.',
    });
  }

  return data.user;
}
