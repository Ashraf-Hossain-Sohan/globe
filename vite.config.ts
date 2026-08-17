import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err: Error, _req, res) => {
            // Always return a response so the browser doesn't throw a native "Failed to fetch" error
            if (!res.headersSent) {
              res.writeHead(504, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: err.message || 'Proxy Error' }))
            }
          })
        }
      }
    }
  }
})
