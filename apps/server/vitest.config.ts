import path from 'node:path';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const packages = path.resolve(__dirname, '..', '..', 'packages');

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    threads: false,
    watch: false,
    reporters: ['verbose'],
    alias: {
      '@cah/store': path.join(packages, 'store', 'src'),
      '@cah/client': path.join(packages, 'client', 'src'),
    },
  },
});
