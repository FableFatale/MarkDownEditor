import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    include: [
      '@lezer/highlight',
      '@codemirror/language-data',
      '@codemirror/language',
      '@codemirror/view'
    ],
    exclude: ['chunk-NNTYP3W4', 'chunk-IOSCVJYZ', 'chunk-6WQIRZJN']
  }
})