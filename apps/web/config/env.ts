/**
 * Reads a runtime config value and throws if it is missing, so a
 * misconfigured deployment fails at startup instead of failing silently
 * later inside a Supabase/Drizzle call.
 */
export function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
