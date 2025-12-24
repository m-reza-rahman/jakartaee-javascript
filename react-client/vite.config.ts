import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  let backendOrigin = 'http://localhost:8080';
  if (env.VITE_API_BASE) {
    try {
      backendOrigin = new URL(env.VITE_API_BASE).origin;
    } catch (err) {
      // Fall back to default origin when URL parsing fails
    }
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