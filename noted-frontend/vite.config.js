import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const reactPlugin = react();

const config = defineConfig({
  plugins: [reactPlugin],
  build: {
    rollupOptions: {
      input: 'src/index.jsx',
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  },
});

export default config;
