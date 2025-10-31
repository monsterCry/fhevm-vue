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
  server: {
    cors: true,
    proxy: {
      '/nft': {
        target: 'https://eth-mainnet.g.alchemy.com',
        changeOrigin: true,
      },
    }
  }
})
//https://eth-mainnet.g.alchemy.com/v2/Cso3EZHJ0EjfjzXTU5oISbtOhBkilFRU