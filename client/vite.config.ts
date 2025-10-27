import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/shared/utils'),
    },
  },
})
