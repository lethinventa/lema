import { createClient } from '@supabase/supabase-js';
import { requireEnv } from '~/config/env';

let client: ReturnType<typeof createClient> | undefined;

/**
 * Browser-safe Supabase client (anon key only — never the service role
 * key). Use for client-side auth flows (sign in, sign up, session).
 */
export function useSupabase() {
  if (!client) {
    const { public: publicConfig } = useRuntimeConfig();
    client = createClient(
      requireEnv('NUXT_PUBLIC_SUPABASE_URL', publicConfig.supabaseUrl),
      requireEnv('NUXT_PUBLIC_SUPABASE_ANON_KEY', publicConfig.supabaseAnonKey),
    );
  }
  return client;
}
