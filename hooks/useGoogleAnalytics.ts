import { useEffect } from 'react';
import { hasAnalyticsConsent } from '../components/CookieConsent';

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
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });

  gaInitialized = true;
}

export function useGoogleAnalytics() {
  useEffect(() => {
    // Try to init if consent already given
    initGA();

    // Listen for consent changes
    const handleConsentChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
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
