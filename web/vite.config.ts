import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import { defineConfig } from 'vite';

let devProxyServer = 'http://localhost:8081';
if (process.env.DEV_PROXY_SERVER && process.env.DEV_PROXY_SERVER.length > 0) {
  devProxyServer = process.env.DEV_PROXY_SERVER;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '^/api': {
        target: devProxyServer,
        xfwd: true,
      },
      '^/memos.api.v1': {
        target: devProxyServer,
        xfwd: true,
      },
      '^/file': {
        target: devProxyServer,
        xfwd: true,
      },
    },
  },
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'app.[hash].js',
        chunkFileNames: 'assets/chunk-vendors.[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
});
