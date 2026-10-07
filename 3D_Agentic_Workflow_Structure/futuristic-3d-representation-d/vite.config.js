import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        palbon: resolve(__dirname, 'palbon.html'),
      },
    },
  },
});



