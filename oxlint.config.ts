import { defineConfig } from 'oxlint';

import eslint from 'oxlint-config-presets/@eslint/recommended.json' with { type: 'json' };
import tsRecommended from 'oxlint-config-presets/@typescript-eslint/recommended-type-checked.json' with { type: 'json' };
import importRecommended from 'oxlint-config-presets/import/recommended.json' with { type: 'json' };
import importTypescript from 'oxlint-config-presets/import/typescript.json' with { type: 'json' };

export default defineConfig({
  plugins: ['eslint', 'typescript', 'oxc'],
  extends: [eslint, tsRecommended, importRecommended, importTypescript],

  options: {
    reportUnusedDisableDirectives: 'error',
    typeAware: true,
  },

  rules: {
    'typescript/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'typescript/require-await': 'off',
    'typescript/no-unsafe-argument': 'off',
    'typescript/no-unsafe-assignment': 'off',
    'typescript/no-unsafe-call': 'off',
    'typescript/no-unsafe-member-access': 'off',
    'typescript/no-unsafe-return': 'off',
  },
});
