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
          proxy.on('error', (err: unknown, _req, res) => {
            if (err.code === 'ECONNREFUSED') {
              // Suppress the huge stack trace when backend is still booting up
              if (!res.headersSent) {
                res.writeHead(504, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Backend is starting up' }))
              }
            }
          })
        }
      }
    }
  }
})
