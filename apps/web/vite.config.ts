/// <reference types="vitest" />
/// <reference types="vite/client" />

import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/api/socket.io': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
      },
    },
  },
  test: {
    globals: true,
    watch: false,
    reporters: ['verbose'],
    setupFiles: './src/vitest.setup.ts',
    transformMode: { web: [/\.[jt]sx?$/] },
    environment: 'jsdom',
  },
});
