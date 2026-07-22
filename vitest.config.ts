import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Required for testing React components and DOM logic
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90
      },
      exclude: [
        'node_modules/',
        'setup.ts',
        '**/*.d.ts',
        '**/*.config.*',
        'tests/e2e/**' // Exclude Playwright tests from unit coverage
      ]
    },
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
