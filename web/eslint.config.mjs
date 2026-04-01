// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

// eslint-config-next registers these plugins natively in flat config format.
// Strip them from FlatCompat output to avoid "Cannot redefine plugin" errors.
const NEXT_OWNED_PLUGINS = ['jsx-a11y', 'react', 'react-hooks', 'import', '@typescript-eslint'];

// Rules that exist in the version of @typescript-eslint installed (v8).
// eslint-config-airbnb-typescript targets v7 and references rules removed in v8
// (e.g. lines-between-class-members). Filter those out to avoid validation errors.
const validTsRules = new Set(Object.keys(tsPlugin.rules ?? {}));

const airbnbConfigs = compat
  .extends('airbnb', 'airbnb/hooks', 'airbnb-typescript')
  .map((config) => {
    let result = { ...config };

    // Strip duplicate plugin registrations
    if (result.plugins) {
      const filteredPlugins = Object.fromEntries(
        Object.entries(result.plugins).filter(([key]) => !NEXT_OWNED_PLUGINS.includes(key)),
      );
      const { plugins: _p, ...rest } = result;
      result = Object.keys(filteredPlugins).length ? { ...rest, plugins: filteredPlugins } : rest;
    }

    // Strip @typescript-eslint/* rules that don't exist in v8
    if (result.rules) {
      result = {
        ...result,
        rules: Object.fromEntries(
          Object.entries(result.rules).filter(([key]) => {
            if (key.startsWith('@typescript-eslint/')) {
              return validTsRules.has(key.slice('@typescript-eslint/'.length));
            }
            return true;
          }),
        ),
      };
    }

    return result;
  });

const eslintConfig = defineConfig([
  // 1. Global ignores
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'node_modules/**']),

  // 2. Airbnb base rules via FlatCompat (plugins de-duped against eslint-config-next)
  ...airbnbConfigs,

  // 3. TypeScript parser config
  {
    // Scope typed linting to src/ — config files like eslint.config.mjs are not in tsconfig.json
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // 4. Next.js rules (override Airbnb where Next.js has an opinion)
  ...nextVitals,
  ...nextTs,

  // 5. Project-specific overrides
  {
    rules: {
      // React 17+ JSX transform — no need to import React in scope
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Next.js <Link> no longer requires a child <a>
      'jsx-a11y/anchor-is-valid': 'off',

      // Allow default exports (Next.js pages/layouts)
      'import/prefer-default-export': 'off',

      // Allow both arrow functions and function declarations for components
      'react/function-component-definition': [
        'error',
        { namedComponents: ['arrow-function', 'function-declaration'] },
      ],

      // Required defaultProps is obsolete with TypeScript
      'react/require-default-props': 'off',

      // Avoid false positives — TypeScript handles this
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],

      // Allow omitting extensions in TS imports
      'import/extensions': [
        'error',
        'ignorePackages',
        { ts: 'never', tsx: 'never', js: 'never', jsx: 'never' },
      ],

      // Import ordering with @/* treated as internal
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Allow prop spreading (common React pattern)
      'react/jsx-props-no-spreading': 'off',

      // Allow void as statement (async event handlers)
      'no-void': ['error', { allowAsStatement: true }],

      // Warn rather than error on array index keys — common in lists without stable IDs
      'react/no-array-index-key': 'warn',

      // Allow devDependency imports in test and setup files
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/__tests__/**',
            '**/test/**',
            '**/*.test.{ts,tsx}',
            '**/*.spec.{ts,tsx}',
            '**/vitest.config.*',
            '**/jest.config.*',
          ],
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
      react: { version: 'detect' },
    },
  },

  // 6. Test file overrides — relax rules that are too strict for test code
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/test/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      // for...of is fine in test files — no regenerator concern in Vitest/Node
      'no-restricted-syntax': 'off',
      // Anonymous functions are standard for vi.fn() constructor mocks
      'func-names': 'off',
    },
  },

  // 7. eslint-config-prettier — MUST BE LAST
  prettier,
]);

export default eslintConfig;
