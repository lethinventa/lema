import { defineVitestConfig } from '@nuxt/test-utils/config';
import { loadEnv } from 'vite';

// Nuxt's runtime config reads process.env at startup, but neither Vite nor
// @nuxt/test-utils' vitest environment load .env into it automatically the
// way `nuxt dev`/`nuxt build` do — without this, useRuntimeConfig() (and
// anything built on it, like useDb()/useSupabaseAdmin()) sees only empty
// strings during tests. Prefix '' loads every var, not just VITE_-prefixed
// ones, since these are server-side (NUXT_...), not client-exposed.
Object.assign(process.env, loadEnv('test', process.cwd(), ''));

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', '.nuxt/**', '.output/**'],
  },
});
