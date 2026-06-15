import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Scope tests to the app's component suites (exclude .claude harness tests).
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['components/**/*.test.{ts,tsx}'],
    environment: 'node',
  },
});
