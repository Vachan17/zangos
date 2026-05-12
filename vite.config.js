import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
    middlewareMode: false,
    hmr: { protocol: 'ws', host: 'localhost', port: 5173 }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'socket': ['socket.io-client'],
          'vendor': ['react', 'react-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, pure_funcs: ['console.log'] },
      output: { comments: false }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 8192
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'socket.io-client'],
    exclude: ['three'],
    esbuildOptions: {
      target: 'esnext'
    }
  }
})
