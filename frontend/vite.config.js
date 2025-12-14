import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, 'src/pages'),
      },
    ],
  },
  server: {
    fs: {
      strict: true,
    },
  },
  optimizeDeps: {
    include: ['@/components/**', '@/pages/**'],
  },
});
