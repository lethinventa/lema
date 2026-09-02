import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    include: ['**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', '.nuxt/**', '.output/**'],
  },
});
