import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { requireEnv } from '~/config/env';
import * as schema from './schema';

// Re-exported so code outside lib/ can build where-clauses without
// importing drizzle-orm directly (see eslint.config.mjs vendor-SDK rule).
// Prefer db.query.<table>.findFirst({ where: (t, {eq}) => ... }) where
// possible, which doesn't need this — only a bare .delete().where(...) does.
export { eq } from 'drizzle-orm';

let client: ReturnType<typeof drizzle<typeof schema>> | undefined;

/**
 * Server-only Drizzle client over the Supabase Postgres connection.
 * Lazily created so importing this file has no side effect until a route
 * actually needs the database.
 */
export function useDb() {
  if (!client) {
    const { databaseUrl } = useRuntimeConfig();
    client = drizzle(postgres(requireEnv('NUXT_DATABASE_URL', databaseUrl)), {
      schema,
    });
  }
  return client;
}
