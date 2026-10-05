import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Node >=17 resolves "localhost" verbatim and takes IPv6 first, so the
    // default bind lands on [::1] only and http://127.0.0.1:5173 is refused.
    // "::" is the dual-stack wildcard, so both 127.0.0.1 and [::1] connect.
    host: "::",
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
