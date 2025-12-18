import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Derive the backend origin from VITE_API_BASE so dev proxy targets the same host.
const defaultApiBase = 'https://localhost:8181/jakartaee-javascript/resources';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE || defaultApiBase;

  let backendOrigin = 'https://localhost:8181';
  try {
    backendOrigin = new URL(apiBase).origin;
  } catch (err) {
    // fall back to default origin when URL parsing fails
  }

  const isProd = mode === 'production';

  return {
    // Ensure built assets resolve correctly under the WAR context path in production
    base: isProd ? '/jakartaee-javascript/static/' : '/',
    plugins: [react()],
    server: {
      proxy: {
        '/auth.jsp': {
          target: backendOrigin,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'build',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  };
});