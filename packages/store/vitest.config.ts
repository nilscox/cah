import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['verbose'],
    watch: false,
    globals: true,
    alias: {
      '@cah/client': path.resolve(__dirname, '..', 'client', 'src'),
    },
  },
});
