import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { terser } from '@rollup/plugin-terser'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip 压缩
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // 只压缩大于1KB的文件
      deleteOriginFile: false, // 保留原文件
      verbose: true
    }),
    // Brotli 压缩（更好的压缩率）
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
      verbose: true
    }),
    // 打包分析器（仅在分析模式下启用）
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  base: '/',
  server: {
    port: 3001,
    open: true,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    // 代码分割优化
    rollupOptions: {
      plugins: [
        // 生产环境代码压缩
        process.env.NODE_ENV === 'production' && terser({
          compress: {
            drop_console: true, // 移除 console.log
            drop_debugger: true, // 移除 debugger
            pure_funcs: ['console.log', 'console.info'], // 移除指定函数
          },
          format: {
            comments: false, // 移除注释
          },
        })
      ].filter(Boolean),
      output: {
        // 手动分包
        manualChunks: {
          // React 相关
          'react-vendor': ['react', 'react-dom'],
          // UI 库
          'ui-vendor': ['framer-motion', '@headlessui/react', '@heroicons/react'],
          // 编辑器相关
          'editor-vendor': [
            '@codemirror/commands',
            '@codemirror/lang-markdown',
            '@codemirror/language',
            '@codemirror/view',
            '@uiw/react-codemirror'
          ],
          // Markdown 处理
          'markdown-vendor': [
            'react-markdown',
            'remark-gfm',
            'remark-math',
            'rehype-katex',
            'rehype-highlight'
          ],
          // 工具库
          'utils-vendor': [
            'lodash',
            'lodash.debounce',
            'axios',
            'uuid'
          ],
          // 文件处理
          'file-vendor': [
            'file-saver',
            'html2canvas',
            'html2pdf.js',
            'jspdf',
            'browser-image-compression'
          ]
        },
        // 文件命名
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.\w+$/, '') || 'chunk'
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name || '')) {
            return `media/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // 构建优化
    target: 'es2015',
    minify: 'terser',
    cssMinify: true,
    // 分包大小警告阈值
    chunkSizeWarningLimit: 1000,
    // 资源内联阈值
    assetsInlineLimit: 4096
  },
  // CSS 优化
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        // 可以在这里添加 PostCSS 插件
      ]
    }
  },
  // 依赖优化
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      '@headlessui/react',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid'
    ],
    exclude: [
      // 排除一些不需要预构建的依赖
    ]
  },

})