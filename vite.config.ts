import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // loadEnv = .env failai; Vercel build'e .env nėra, kintamieji tik process.env – sujungiame
    const env = { ...loadEnv(mode, '.', ''), ...process.env };
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.AI_API_KEY': JSON.stringify(env.AI_API_KEY),
        'process.env.VIN_API_KEY': JSON.stringify(env.VIN_API_KEY),
        'process.env.VIN_VEHICLE_IDENTITY_ONLY': JSON.stringify(env.VIN_VEHICLE_IDENTITY_ONLY),
        'process.env.VIN_SKIP_SERVICE_HISTORY': JSON.stringify(env.VIN_SKIP_SERVICE_HISTORY),
        'process.env.DISABLE_MOCK_REPORT': JSON.stringify(env.DISABLE_MOCK_REPORT),
        'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.FIREBASE_STORAGE_BUCKET),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.FIREBASE_MESSAGING_SENDER_ID),
        'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
