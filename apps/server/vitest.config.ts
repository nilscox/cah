import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const packages = path.resolve(__dirname, '..', '..', 'packages');

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    threads: false,
    watch: false,
    reporters: ['verbose'],
    deps: {
      registerNodeLoader: true,
    },
  },
});
