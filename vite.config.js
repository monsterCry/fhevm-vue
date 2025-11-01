import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    assetsInclude: ['**/*.js', '**/*.json', '**/*.html'],
    rollupOptions: {
      input: {
        main: './index.html',
        about: './intr.html',
      }
    }
  }
})
//https://eth-mainnet.g.alchemy.com/v2/Cso3EZHJ0EjfjzXTU5oISbtOhBkilFRU