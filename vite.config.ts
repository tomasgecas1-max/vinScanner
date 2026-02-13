import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // loadEnv = .env failai; Vercel build'e .env nėra – naudojame process.env; Vercel Vite gali duoti tik VITE_*
    const env = { ...loadEnv(mode, '.', ''), ...process.env };
    const firebaseApiKey = env.FIREBASE_API_KEY ?? env.VITE_FIREBASE_API_KEY;
    const firebaseAuthDomain = env.FIREBASE_AUTH_DOMAIN ?? env.VITE_FIREBASE_AUTH_DOMAIN;
    const firebaseProjectId = env.FIREBASE_PROJECT_ID ?? env.VITE_FIREBASE_PROJECT_ID;
    const firebaseStorageBucket = env.FIREBASE_STORAGE_BUCKET ?? env.VITE_FIREBASE_STORAGE_BUCKET;
    const firebaseMessagingSenderId = env.FIREBASE_MESSAGING_SENDER_ID ?? env.VITE_FIREBASE_MESSAGING_SENDER_ID;
    const firebaseAppId = env.FIREBASE_APP_ID ?? env.VITE_FIREBASE_APP_ID;
    const hasFirebase = !!(firebaseApiKey && firebaseProjectId);
    console.log('[vite] Firebase env:', hasFirebase ? 'present (Prisijungti bus rodomas)' : 'MISSING – pridėk FIREBASE_* arba VITE_FIREBASE_* Vercel');
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
        'process.env.FIREBASE_API_KEY': JSON.stringify(firebaseApiKey),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(firebaseAuthDomain),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify(firebaseProjectId),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(firebaseStorageBucket),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(firebaseMessagingSenderId),
        'process.env.FIREBASE_APP_ID': JSON.stringify(firebaseAppId),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
