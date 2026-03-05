import * as Sentry from '@sentry/node';

const SENTRY_DSN = process.env.SENTRY_DSN;

let initialized = false;

export function initSentry() {
  if (initialized || !SENTRY_DSN) return;
  
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.VERCEL_ENV || 'development',
    tracesSampleRate: 0.1,
  });
  
  initialized = true;
}

export function captureError(error, context = {}) {
  if (!SENTRY_DSN) return;
  
  initSentry();
  Sentry.captureException(error, { extra: context });
}

export function captureMessage(message, level = 'info', context = {}) {
  if (!SENTRY_DSN) return;
  
  initSentry();
  Sentry.captureMessage(message, { level, extra: context });
}

export { Sentry };
