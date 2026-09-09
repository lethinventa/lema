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

const dbAccessPattern = {
  group: ['**/lib/db/*'],
  message:
    'DB access must go through a *.repository.ts file — services call repositories, not Drizzle directly.',
};

// The rule's schema rejects an empty `zones` array, so it's turned off
// entirely until at least one feature directory actually exists — see
// ADR-002-feature-folder-structure.md. Built as a standalone typed value
// (rather than conditionally spread into the withNuxt(...) call below)
// because spreading loses TypeScript's contextual typing for the rule
// tuple, widening 'error' to `string` and breaking the schema.
//
// A feature may import another feature's index.ts (its public API — see
// featureIndexOnlyPattern below, which is what enforces "index.ts only" for
// code outside any feature) but never another feature's internal files;
// only its own internals are unrestricted. Hence `except` allows the
// feature's own directory in full, plus every *other* feature's index.
/** @type {import('eslint').Linter.RuleEntry} */
const noRestrictedPathsRule =
  features.length > 0
    ? [
        'error',
        {
          zones: features.map((feature) => ({
            target: `./features/${feature}`,
            from: './features',
            except: [
              `./${feature}`,
              ...features
                .filter((other) => other !== feature)
                .map((other) => `./${other}/index.ts`),
            ],
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
    // Drizzle) must not be imported directly. Test files are exempt from
    // the vendor-SDK part below (see the two blocks that follow this one).
    files: ALL_FILES,
    ignores: ['lib/**', 'features/**', '**/*.test.ts'],
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
    // Same as above, restated for *.test.ts files outside lib/ and
    // features/: they legitimately need real vendor clients for fixtures/
    // assertions/cleanup (same reasoning as their exemption from
    // dbAccessPattern further below), so vendorSdkPaths is dropped here.
    files: ['**/*.test.ts'],
    ignores: ['lib/**', 'features/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [noRelativeParentImportPattern, featureIndexOnlyPattern] },
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
    ignores: ['**/*.test.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [noRelativeParentImportPattern], paths: vendorSdkPaths },
      ],
    },
  },
  {
    // Same as above, restated for *.test.ts files inside a feature — vendor
    // SDKs allowed for the same fixture/assertion/cleanup reasons as the
    // block above, featureIndexOnlyPattern still dropped for the same
    // same-feature-import reason.
    files: ['features/**/*.test.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [noRelativeParentImportPattern] },
      ],
    },
  },
  {
    // Only *.repository.ts files may talk to the DB layer (useDb()/schema
    // tables) — services call repositories instead, never Drizzle directly
    // (CLAUDE.md, ADR-002). Test files are exempt: they legitimately need
    // direct DB access for fixtures/assertions/cleanup, which isn't part of
    // the app's own service->repository call chain this rule protects.
    // *.factory.ts files are exempt for the same reason as *.repository.ts:
    // defineFactory() needs the actual schema Table objects to build fixture
    // data, which is what this rule otherwise reserves for repositories.
    files: ['features/*/server/**'],
    ignores: [
      'features/*/server/**/*.repository.ts',
      'features/*/server/**/*.factory.ts',
      'features/*/server/**/*.test.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [noRelativeParentImportPattern, dbAccessPattern],
          paths: vendorSdkPaths,
        },
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
  {
    // Top-level SFC blocks always in the same order — see CLAUDE.md.
    files: ['**/*.vue'],
    rules: {
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
    },
  },
  // Turns off ESLint's stylistic rules so they don't fight Prettier — must
  // stay last so it overrides anything earlier in the array.
  eslintConfigPrettier,
);
