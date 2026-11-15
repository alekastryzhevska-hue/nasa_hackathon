import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative paths, so the built app works both at the site root and in a subfolder
  // (GitHub Pages serves it at /nasa_hackathon/).
  base: './',
  plugins: [react()],
})
