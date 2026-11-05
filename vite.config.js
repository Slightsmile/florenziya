import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 600,
  },
  server: {
    // Allow `npm run dev:vite` to reach the same API as `vercel dev`.
    // Needs `vercel dev` running (or a deployed API) for POSTs to succeed.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})
