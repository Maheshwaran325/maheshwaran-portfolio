import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep every asset a real file. The brand mark sits just under Vite's
    // 4 KB inline threshold, and base64-ing it put the same bytes in both the
    // prerendered HTML of all five routes and the JS bundle — more weight than
    // the one immutably-cached request it saved.
    assetsInlineLimit: 0,
  },
})
