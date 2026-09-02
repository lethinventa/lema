import { defineConfig } from 'drizzle-kit';

// Runs outside the Nuxt runtime (drizzle-kit CLI), so it reads process.env
// directly instead of useRuntimeConfig().
export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NUXT_DATABASE_URL!,
  },
});
