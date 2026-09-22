import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    maxWorkers: 1,
    watch: false,
    reporters: ['verbose'],
  },
});
