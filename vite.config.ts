import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.ONE_AUTO_API_KEY': JSON.stringify(env.ONE_AUTO_API_KEY),
        'process.env.ONE_AUTO_VEHICLE_IDENTITY_ONLY': JSON.stringify(env.ONE_AUTO_VEHICLE_IDENTITY_ONLY),
        'process.env.ONE_AUTO_SKIP_SERVICE_HISTORY': JSON.stringify(env.ONE_AUTO_SKIP_SERVICE_HISTORY),
        'process.env.DISABLE_MOCK_REPORT': JSON.stringify(env.DISABLE_MOCK_REPORT),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
