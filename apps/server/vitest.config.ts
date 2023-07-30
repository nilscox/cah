import path from 'node:path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    threads: false,
    watch: false,
    reporters: ['verbose'],
    alias: {
      '@cah/store': path.resolve(__dirname, '..', 'store', 'src'),
      '@cah/client': path.resolve(__dirname, '..', 'client', 'src'),
    },
  },
});
