import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages: repo is served at /react_only_dashboard/
  base: '/react_only_dashboard/',
  publicDir: 'public',
})
