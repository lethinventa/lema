// @ts-check
import eslintConfigPrettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import { readdirSync } from 'node:fs';
import withNuxt from './.nuxt/eslint.config.mjs';

const ALL_FILES = ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,vue}'];

const features = readdirSync(new URL('./features', import.meta.url), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

// Relative imports that climb out of a directory are disallowed — use the
// `~/` alias instead. This is a plain regex on the import text (not a
// resolved-path check): a resolver that understands the `~/` alias would
// make a resolved-path version of this rule fire on alias imports too,
// since those also resolve to a path outside the current directory.
const noRelativeParentImportPattern = {
  regex: '^\\.\\./',
  message:
    'Relative imports that climb out of a directory are not allowed — use the `~/` alias instead.',
};

const featureIndexOnlyPattern = {
  group: ['**/features/*/**', '!**/features/*/index'],
  message:
    "Import only the feature's index.ts (its public API), not an internal file.",
};

const vendorSdkPaths = [
  {
    name: '@supabase/supabase-js',
    message: 'Import via lib/supabase instead.',
  },
  { name: 'drizzle-orm', message: 'Import via lib/db instead.' },
];

// The rule's schema rejects an empty `zones` array, so it's turned off
// entirely until at least one feature directory actually exists — see
// ADR-002-feature-folder-structure.md. Built as a standalone typed value
// (rather than conditionally spread into the withNuxt(...) call below)
// because spreading loses TypeScript's contextual typing for the rule
// tuple, widening 'error' to `string` and breaking the schema.
/** @type {import('eslint').Linter.RuleEntry} */
const noRestrictedPathsRule =
  features.length > 0
    ? [
        'error',
        {
          zones: features.map((feature) => ({
            target: `./features/${feature}`,
            from: './features',
            except: [`./${feature}`],
          })),
        },
      ]
    : 'off';

export default withNuxt(
  {
    // A feature must not reach into another feature's internals, whether
    // imported by relative path or by the `~/` alias. Zones are generated
    // from the features/ directory so a new feature is covered
    // automatically.
    //
    // Needs the TypeScript resolver pointed at the *generated*
    // .nuxt/tsconfig.json (the root tsconfig.json is just an empty
    // project-references stub) so `~/features/x` imports resolve to a real
    // path and can be checked against the zones.
    files: ALL_FILES,
    plugins: { 'import-x': importX },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: ['.nuxt/tsconfig.json'],
        }),
      ],
    },
    rules: {
      'import-x/no-restricted-paths': noRestrictedPathsRule,
    },
  },
  {
    // Outside lib/ and features/: no climbing relative imports, only a
    // feature's public API may be imported, and vendor SDKs (Supabase,
    // Drizzle) must not be imported directly.
    files: ALL_FILES,
    ignores: ['lib/**', 'features/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [noRelativeParentImportPattern, featureIndexOnlyPattern],
          paths: vendorSdkPaths,
        },
      ],
    },
  },
  {
    // Inside a feature: featureIndexOnlyPattern is deliberately dropped.
    // It's a textual match on `**/features/*/**`, so it can't tell "another
    // file inside this same feature" apart from "code outside the feature
    // reaching into its internals" — cross-feature isolation is already
    // fully enforced by import-x/no-restricted-paths above (resolved-path
    // based, so it knows which feature is which). Without this override, a
    // composable couldn't import a sibling types.ts one directory up.
    files: ['features/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [noRelativeParentImportPattern], paths: vendorSdkPaths },
      ],
    },
  },
  {
    // Inside lib/: vendor SDKs are allowed (that's the point of lib/), but
    // the other two rules still hold.
    files: ['lib/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [noRelativeParentImportPattern, featureIndexOnlyPattern] },
      ],
    },
  },
  {
    // Nuxt UI components (auto-imported, so no-restricted-imports can't see
    // them — there's no import statement) must go through shared/components
    // instead of being used directly in a feature or page, mitigating
    // vendor lock-in the same way lib/ does for SDKs. app.vue is exempt: its
    // single <UApp> call is the Nuxt UI app-level provider (toaster, color
    // mode, etc.), not a swappable base component like a button or input.
    files: ['**/*.vue'],
    ignores: ['shared/components/**', 'app.vue'],
    rules: {
      'vue/no-restricted-syntax': [
        'error',
        {
          selector: 'VElement[rawName=/^U[A-Z]/]',
          message:
            'Import base UI components from shared/components instead of Nuxt UI directly.',
        },
      ],
    },
  },
  {
    // Wrapper components in shared/components deliberately use generic,
    // often single-word names (Input.vue, Button.vue...) instead of the
    // vendor's prefixed ones (UInput, UButton...) — see CLAUDE.md.
    files: ['shared/components/**'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  // Turns off ESLint's stylistic rules so they don't fight Prettier — must
  // stay last so it overrides anything earlier in the array.
  eslintConfigPrettier,
);
