import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['e2e/**'],
    environment: 'node'
  },
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, 'src/lib')
    }
  }
});

