import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    // Disable sourcemaps in production to protect source code
    sourcemap: false,
    // Warn about large chunks above 800kb (Vite default is 500kb)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split vendor libraries into a separate chunk for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
        }
      }
    }
  },
  // Shorter asset file names for production
  assetsDir: 'assets',
}))
