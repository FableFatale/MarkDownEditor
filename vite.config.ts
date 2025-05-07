import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  // 确保正确处理CSS文件
  css: {
    devSourcemap: true
  }
})