import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/mgc-test-demo/',
  plugins: [react()],
   server: {
    host: true,
    strictPort: false,
    // Optionally, you can also set allowedHosts to 'all' to allow all hosts
    allowedHosts: true
  }
})
