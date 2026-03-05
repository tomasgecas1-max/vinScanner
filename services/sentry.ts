import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

export function initSentry() {
  if (!SENTRY_DSN || typeof window === 'undefined') return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE || 'production',
    
    // Performance monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    
    // Session replay (optional - uses more bandwidth)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Ignore common non-actionable errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
      /Loading chunk \d+ failed/,
      /Network request failed/,
    ],
    
    beforeSend(event) {
      // Don't send events in development
      if (import.meta.env.DEV) {
        return null;
      }
      return event;
    },
  });
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
}

export function setUser(userId: string, email?: string) {
  if (SENTRY_DSN) {
    Sentry.setUser({ id: userId, email });
  }
}

export function clearUser() {
  if (SENTRY_DSN) {
    Sentry.setUser(null);
  }
}

export { Sentry };
