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
    // Route tests (server/api/**/*.test.ts) boot a real Nitro server as a
    // subprocess via setup() from @nuxt/test-utils/e2e (see CLAUDE.md's
    // route-test rule) — running that concurrently with another file's own
    // `nuxt`-environment boot starves both for CPU on a resource-constrained
    // CI runner, intermittently blowing past the default 10s hookTimeout
    // (observed on PR #6's CI: config/env.test.ts's environment setup timed
    // out while a route test's server was booting alongside it). Disabling
    // file parallelism removes that contention; the timeout bump is extra
    // margin for a plain slow CI machine, independent of contention.
    fileParallelism: false,
    hookTimeout: 30000,
  },
});
