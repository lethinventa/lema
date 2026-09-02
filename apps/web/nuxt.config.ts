// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 defaults srcDir to `app/`; flattened back to the app root to match
  // the feature-folder layout in docs/architecture/decisions/ADR-002-feature-folder-structure.md
  srcDir: '.',
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Auto-import wiring for the feature-folder layout (no Nuxt Layers — see
  // docs/architecture/decisions/ADR-002-feature-folder-structure.md).
  imports: {
    dirs: [
      'shared/composables',
      'shared/utils',
      'features/*/composables',
      'features/*/utils',
    ],
  },
  components: {
    dirs: ['~/shared/components', '~/features/*/components'],
  },

  // Server-only keys stay at the top level; anything under `public` is sent
  // to the client bundle. Real values come from .env (see .env.example) —
  // these are just the runtimeConfig <-> env var mapping, not secrets.
  runtimeConfig: {
    databaseUrl: '',
    supabaseServiceRoleKey: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },
});
