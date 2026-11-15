import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site from /full-stack-project/; dev server stays at /
  base: command === 'build' ? '/full-stack-project/' : '/',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
  test: { environment: 'jsdom', globals: true, setupFiles: './src/setupTests.js' },
}));
