import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: false
  },
  build: {
    // Disable sourcemaps in production to protect source code
    sourcemap: false,
    // Warn about large chunks above 800kb
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
  assetsDir: 'assets',
}));
