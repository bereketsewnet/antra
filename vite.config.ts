import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Local dev only: forward PHP API calls to the PHP server (started with
  // `php -S localhost:8080 -t server`). Lets `npm run dev` talk to the real
  // PHP + MySQL backend. Has no effect on the production build.
  server: {
    proxy: {
      '/api':      { target: 'http://localhost:8080', changeOrigin: true },
      '/mail.php': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Split node_modules into stable vendor chunks: they download in
        // parallel and stay cached across deploys (only app code changes).
        advancedChunks: {
          groups: [
            { name: 'react',  test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils|gsap|@gsap|lenis)[\\/]/ },
            { name: 'vendor', test: /node_modules[\\/]/ },
          ],
        },
      },
    },
  },
})
