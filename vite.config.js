import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Adjust base path if hosting at subpath
export default defineConfig({
  plugins: [react()],
  base: '/', // Use '/' for root domain
})
