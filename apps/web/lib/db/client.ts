import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { requireEnv } from '~/config/env';
import * as schema from './schema';

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
