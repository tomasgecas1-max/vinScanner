import { useEffect } from 'react';
import { hasAnalyticsConsent, getConsentPreferences } from '../components/CookieConsent';
import { updateGtagConsent } from '../lib/gtagConsent';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

let gaInitialized = false;

function initGA() {
  if (gaInitialized || !GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });

  gaInitialized = true;
}

export function useGoogleAnalytics() {
  useEffect(() => {
    const stored = getConsentPreferences();
    if (stored) {
      updateGtagConsent(stored);
    }

    initGA();

    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.analytics === 'boolean' && typeof detail.marketing === 'boolean') {
        updateGtagConsent(detail);
      }
      if (detail?.analytics) {
        initGA();
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange);
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);
}

function canTrack(): boolean {
  return typeof window !== 'undefined' && window.gtag && !!GA_MEASUREMENT_ID && hasAnalyticsConsent();
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (canTrack()) {
    window.gtag('event', eventName, params);
  }
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  if (canTrack()) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
}

export function trackPurchase(orderId: string, value: number, currency = 'EUR') {
  if (canTrack()) {
    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      value,
      currency,
    });
  }
}

export function trackVinSearch(vin: string) {
  if (canTrack()) {
    window.gtag('event', 'search', {
      search_term: vin,
    });
  }
}

/** GA ID iš index.html – naudojamas user_id ir login event */
const GA_ID_FROM_HTML = 'G-FBYC8P2RK4';

function canTrackGtag(): boolean {
  return typeof window !== 'undefined' && !!window.gtag && hasAnalyticsConsent();
}

/** Siunčia user_id į GA prisijungus – leidžia matyti prisijungusius vartotojus GA4 */
export function setUserId(userId: string | null) {
  if (!canTrackGtag()) return;
  window.gtag('config', GA_ID_FROM_HTML, {
    user_id: userId || undefined,
  });
}

/** Įvykis prisijungus – matomas GA4 Events */
export function trackLogin(method: string) {
  if (canTrackGtag()) {
    window.gtag('event', 'login', { method });
  }
}
