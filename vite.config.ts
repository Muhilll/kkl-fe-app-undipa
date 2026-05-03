import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [devtools(), solidPlugin()],
    server: {
      port: parseInt(env.PORT || '2000', 10),
    },
    build: {
      target: 'esnext',
    },
  };
});
