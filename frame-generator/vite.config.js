import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// heic2any is only pulled in when someone actually uploads a HEIC file, so it
// stays out of the main bundle and off the critical path.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:3001',
      '/s': 'http://localhost:3001',
      '/i': 'http://localhost:3001',
    },
  },
})
