import { defineConfig } from 'vitest/config';

export default defineConfig({
  server: {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 8000,
  },
  test: {
    globals: true,
  },
});
