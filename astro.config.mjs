// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],

    optimizeDeps: {
      include: ['firebase/compat/app', 'firebase/compat/database']
    },

    ssr: {
      external: []
    }
  }
})
