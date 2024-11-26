import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Optional alias setup, useful for larger projects
    },
  },
  server: {
    port: 5701, // You can change the port number if needed
  },
});
