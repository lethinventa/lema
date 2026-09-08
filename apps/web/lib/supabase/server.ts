import { createClient } from '@supabase/supabase-js';
import { requireEnv } from '~/config/env';

/**
 * Server-only Supabase client using the service role key — bypasses row
 * level security, so it must never be exposed to the client. Create a new
 * instance per call rather than caching a module-level singleton, since
 * server code may need to act with different request contexts.
 */
export function useSupabaseAdmin() {
  const { supabaseServiceRoleKey, public: publicConfig } = useRuntimeConfig();
  return createClient(
    requireEnv('NUXT_PUBLIC_SUPABASE_URL', publicConfig.supabaseUrl),
    requireEnv('NUXT_SUPABASE_SERVICE_ROLE_KEY', supabaseServiceRoleKey),
  );
}
