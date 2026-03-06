/**
 * Google Consent Mode v2 – susiejimas su slapukų sutikimu.
 * Naudojamas GA4 ir Google Ads (AW-17997560234).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateGtagConsent(prefs: { analytics: boolean; marketing: boolean }) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    ad_storage: prefs.marketing ? 'granted' : 'denied',
    ad_user_data: prefs.marketing ? 'granted' : 'denied',
    ad_personalization: prefs.marketing ? 'granted' : 'denied',
  });
}
