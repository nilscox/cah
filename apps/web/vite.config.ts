/// <reference types="vitest" />
/// <reference types="vite/client" />

import path from 'node:path';

import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

const packages = path.resolve(__dirname, '..', '..', 'packages');

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@cah/client': path.join(packages, 'client', 'src'),
      '@cah/store': path.join(packages, 'store', 'src'),
    },
  },
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/socket.io': {
        target: 'http://localhost:3000',
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
