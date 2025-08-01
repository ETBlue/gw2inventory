import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  base: '/gw2inventory/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
})