import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // <--- THIS PREVENTS THE WHITE SCREEN ON ANDROID
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})