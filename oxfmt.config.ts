import { defineConfig } from 'oxfmt';

export default defineConfig({
  ignorePatterns: ['apps/server/src/**/snapshot.json'],
  printWidth: 110,
  singleQuote: true,
});
