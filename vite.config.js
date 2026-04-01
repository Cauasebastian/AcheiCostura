import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acesso de fora do container
    port: 5173,
    // Configurações específicas para HMR no Docker
    watch: {
      usePolling: true, // Necessário para Docker
      interval: 1000
    },
    hmr: {
      clientPort: 5173, // Importante para HMR funcionar
      overlay: true
    }
  }
})