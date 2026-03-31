import { defineConfig } from 'vite';

export default defineConfig({
  // Configure Vite here. Vercel automatically detects Vite projects.
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
});
