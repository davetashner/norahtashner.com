import { defineConfig } from 'vite';

export default defineConfig({
  base: '/games/comet-catcher/',
  server: {
    port: 5174,
    host: true,
    strictPort: true
  },
  build: {
    target: 'es2020',
    sourcemap: false
  }
});
