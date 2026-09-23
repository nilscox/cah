import { defineConfig } from 'oxfmt';

export default defineConfig({
  ignorePatterns: ['apps/server/src/**/snapshot.json'],
  printWidth: 110,
  singleQuote: true,
  sortTailwindcss: true,
  sortImports: {
    internalPattern: ['src/'],
    groups: [
      ['builtin'],
      ['external'],
      'internal',
      ['value-parent'],
      ['value-sibling', 'value-index'],
      'unknown',
    ],
  },
});
