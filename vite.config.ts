import { defineConfig } from 'vite';
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: "app",
  server: {
    port: 8080,
    strictPort: true,
    host: true,
    proxy: {
      '/api': 'http://localhost:7071'
    }
  },
  build: {
    outDir: "../dist",
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'app/index.html'),
        nested: resolve(__dirname, 'app/spectate.html')
      }
    }
  },
  plugins: []
})
