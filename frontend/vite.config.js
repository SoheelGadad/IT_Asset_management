import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // 1. Set base to './' so assets are loaded relative to the index.html
    base: './', 
    
    plugins: [react()],
    
    server: {
      port: 3000,
      proxy: {
        // This only applies during local development (npm run dev)
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
        }
      }
    },
    
    // 2. Ensure build output goes to a clean directory
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  }
})