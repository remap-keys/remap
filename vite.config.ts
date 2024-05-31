import react from '@vitejs/plugin-react';
import { defineConfig, Plugin, loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), envPlugin(), nodePolyfills()],
    esbuild: {},
    root: 'src',
    publicDir: '../public',
    build: {
      sourcemap: true,
      outDir: '../build',
    },
    server: {
      port: 3000,
    },
  };
});

function envPlugin(): Plugin {
  return {
    name: 'env-plugin',
    config(_, { mode }) {
      const env = loadEnv(mode, '.', ['REACT_APP_', 'NODE_ENV']);
      return {
        define: Object.fromEntries(
          Object.entries(env).map(([key, value]) => [
            `import.meta.env.${key}`,
            JSON.stringify(value),
          ])
        ),
      };
    },
  };
}
