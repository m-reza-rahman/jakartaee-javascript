import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Derive the backend origin from VITE_API_BASE so dev proxy targets the same host.
const defaultApiBase = 'http://localhost:8080/jakartaee-javascript/resources';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE || defaultApiBase;

  let backendOrigin = 'http://localhost:8080';
  try {
    backendOrigin = new URL(apiBase).origin;
  } catch (err) {
    // fall back to default origin when URL parsing fails
  }

  const isProd = mode === 'production';

  return {
    // Ensure built assets resolve correctly under the WAR context path in production
    base: isProd ? '/static/' : '/',
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