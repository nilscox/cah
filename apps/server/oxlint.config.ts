import { defineConfig } from 'oxlint';

import baseConfig from '../../oxlint.config.ts';

export default defineConfig({
  extends: [baseConfig],
  rules: {
    'eslint/no-restricted-imports': [
      'error',
      { patterns: ['src/adapters/**', 'src/interfaces/**', 'src/persistence/**'] },
    ],
  },
});
