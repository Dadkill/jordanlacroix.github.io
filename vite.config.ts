import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [react()],
  css: { postcss: { plugins: [tailwindcss()] } },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  publicDir: isSsrBuild ? false : 'public',
  build: { sourcemap: false, target: 'es2022' },
  server: { host: '127.0.0.1', port: 3000, strictPort: true },
}));
