// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),           // ← официальный плагин Tailwind v4 для Vite
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),   // удобно: import ... from '@/components/...'
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',       // ← замени на порт твоего бэкенда
        changeOrigin: true,
        secure: false,
      },
    },
  },
})