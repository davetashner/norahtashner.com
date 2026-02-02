import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Adjust base path if hosting at subpath
export default defineConfig({
  plugins: [react()],
  base: '/', // Use '/' for root domain
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        'tools/',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
})
