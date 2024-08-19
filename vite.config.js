import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 关键代码

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 关键代码
      '@': path.resolve(__dirname, './src')
    }
  }
})
