import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  webServer: {
    command: 'npx nuxt dev',
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  // `nuxt dev` (not a production build) compiles a route's client bundle on
  // its first request rather than upfront — the webServer readiness check
  // only waits for the server to respond, not for that first compile, so a
  // page's first assertion can still be racing it. Default expect timeout
  // (5s) was enough headroom locally but flaked in CI (observed on PR #6:
  // getByText('Lema') timed out once, passed cleanly on other runs).
  expect: {
    timeout: 10000,
  },
});
