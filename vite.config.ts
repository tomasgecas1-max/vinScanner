import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/** Vite plugin: CarsXE API proxy (CORS aplinkoj – naršyklė negali kreiptis tiesiai į api.carsxe.com) */
function carsxeProxyPlugin(apiKey: string | undefined) {
  return {
    name: 'carsxe-proxy',
    configureServer(server: { middlewares: { use: (fn: (req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => void) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        const isSpecs = url.startsWith('/api/carsxe-specs') && req.method === 'GET';
        const isHistory = url.startsWith('/api/carsxe-history') && req.method === 'GET';
        if (isSpecs || isHistory) {
          const u = new URL(url, 'http://localhost');
          const vin = u.searchParams.get('vin')?.trim();
          if (!vin || !apiKey) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: apiKey ? 'vin reikalingas' : 'CARSXE_API_KEY nenustatytas' }));
            return;
          }
          const endpoint = isSpecs ? 'specs' : 'history';
          try {
            const r = await fetch(`https://api.carsxe.com/${endpoint}?key=${encodeURIComponent(apiKey)}&vin=${encodeURIComponent(vin)}`);
            const data = await r.json();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          } catch (e) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e instanceof Error ? e.message : String(e) }));
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    // loadEnv = .env failai; Vercel build'e .env nėra – naudojame process.env; Vercel Vite gali duoti tik VITE_*
    const env = { ...loadEnv(mode, '.', ''), ...process.env };
    const carsxeApiKey = env.CARSXE_API_KEY ?? env.VITE_CARSXE_API_KEY;
    const firebaseApiKey = env.FIREBASE_API_KEY ?? env.VITE_FIREBASE_API_KEY;
    const firebaseAuthDomain = env.FIREBASE_AUTH_DOMAIN ?? env.VITE_FIREBASE_AUTH_DOMAIN;
    const firebaseProjectId = env.FIREBASE_PROJECT_ID ?? env.VITE_FIREBASE_PROJECT_ID;
    const firebaseStorageBucket = env.FIREBASE_STORAGE_BUCKET ?? env.VITE_FIREBASE_STORAGE_BUCKET;
    const firebaseMessagingSenderId = env.FIREBASE_MESSAGING_SENDER_ID ?? env.VITE_FIREBASE_MESSAGING_SENDER_ID;
    const firebaseAppId = env.FIREBASE_APP_ID ?? env.VITE_FIREBASE_APP_ID;
    const hasFirebase = !!(firebaseApiKey && firebaseProjectId);
    const aiApiKey = env.AI_API_KEY ?? env.VITE_AI_API_KEY ?? env.GEMINI_API_KEY;
    const gaMeasurementId = env.GA_MEASUREMENT_ID ?? env.VITE_GA_MEASUREMENT_ID;
    const sentryDsn = env.SENTRY_DSN ?? env.VITE_SENTRY_DSN;
    console.log('[vite] Firebase env:', hasFirebase ? 'present (Prisijungti bus rodomas)' : 'MISSING – pridėk FIREBASE_* arba VITE_FIREBASE_* Vercel');
    console.log('[vite] AI_API_KEY:', aiApiKey ? 'present' : 'MISSING – pridėk AI_API_KEY arba VITE_AI_API_KEY (Vercel Environment Variables)');
    console.log('[vite] CARSXE_API_KEY:', carsxeApiKey ? 'present (proxy įjungtas)' : 'MISSING – Automobilio specifikacijos neveiks');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), carsxeProxyPlugin(carsxeApiKey)],
      define: {
        'process.env.AI_API_KEY': JSON.stringify(aiApiKey),
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
        'import.meta.env.VITE_GA_MEASUREMENT_ID': JSON.stringify(gaMeasurementId),
        'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(sentryDsn),
        // CARSXE_API_KEY – tik serveryje (proxy / Vercel api), į klientą NĖRA perduodamas
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
