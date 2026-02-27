import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  lang: 'lt' | 'en';
}

const COOKIE_CONSENT_KEY = 'vinscanner_cookie_consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'custom';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const translations = {
  lt: {
    title: 'Slapukų nustatymai',
    description: 'Naudojame slapukus, kad pagerintume jūsų patirtį. Analitiniai slapukai padeda mums suprasti, kaip naudojatės svetaine.',
    acceptAll: 'Priimti visus',
    rejectAll: 'Atmesti nebūtinus',
    customize: 'Nustatymai',
    save: 'Išsaugoti',
    necessary: 'Būtini slapukai',
    necessaryDesc: 'Reikalingi svetainės veikimui. Negali būti išjungti.',
    analytics: 'Analitiniai slapukai',
    analyticsDesc: 'Padeda suprasti, kaip lankytojai naudojasi svetaine (Google Analytics).',
    marketing: 'Rinkodaros slapukai',
    marketingDesc: 'Naudojami reklamai pritaikyti pagal jūsų interesus.',
    privacyLink: 'Privatumo politika',
  },
  en: {
    title: 'Cookie Settings',
    description: 'We use cookies to improve your experience. Analytics cookies help us understand how you use the website.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject Non-essential',
    customize: 'Customize',
    save: 'Save',
    necessary: 'Necessary Cookies',
    necessaryDesc: 'Required for the website to function. Cannot be disabled.',
    analytics: 'Analytics Cookies',
    analyticsDesc: 'Help us understand how visitors use the website (Google Analytics).',
    marketing: 'Marketing Cookies',
    marketingDesc: 'Used to personalize ads based on your interests.',
    privacyLink: 'Privacy Policy',
  },
};

export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return null;
}

export function hasAnalyticsConsent(): boolean {
  const prefs = getConsentPreferences();
  return prefs?.analytics ?? false;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ lang }) => {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const t = translations[lang];

  useEffect(() => {
    const stored = getConsentPreferences();
    if (!stored) {
      setVisible(true);
    } else {
      setPreferences(stored);
    }
  }, []);

  const saveConsent = (prefs: ConsentPreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setVisible(false);
    setShowCustomize(false);

    // Dispatch event for GA to listen
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: prefs }));

    // If analytics rejected, try to disable GA
    if (!prefs.analytics && typeof window !== 'undefined') {
      (window as unknown as Record<string, boolean>)['ga-disable-' + (import.meta.env.VITE_GA_MEASUREMENT_ID || '')] = true;
    }
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                <path d="M8.5 8.5v.01"/>
                <path d="M16 15.5v.01"/>
                <path d="M12 12v.01"/>
                <path d="M11 17v.01"/>
                <path d="M7 14v.01"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{t.title}</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{t.description}</p>
        </div>

        {/* Customize Panel */}
        {showCustomize && (
          <div className="px-6 pb-4 space-y-3 border-t border-slate-100 pt-4">
            {/* Necessary */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="mt-1 w-5 h-5 rounded border-slate-300"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900 text-sm">{t.necessary}</div>
                <div className="text-xs text-slate-500">{t.necessaryDesc}</div>
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900 text-sm">{t.analytics}</div>
                <div className="text-xs text-slate-500">{t.analyticsDesc}</div>
              </div>
            </div>

            {/* Marketing */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900 text-sm">{t.marketing}</div>
                <div className="text-xs text-slate-500">{t.marketingDesc}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
          {showCustomize ? (
            <>
              <button
                onClick={() => setShowCustomize(false)}
                className="flex-1 px-4 py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                ← {lang === 'lt' ? 'Atgal' : 'Back'}
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors"
              >
                {t.save}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
              >
                {t.rejectAll}
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="flex-1 px-4 py-3 text-indigo-600 font-medium rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-colors text-sm"
              >
                {t.customize}
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors text-sm"
              >
                {t.acceptAll}
              </button>
            </>
          )}
        </div>

        {/* Privacy link */}
        <div className="px-6 pb-4 text-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openPrivacyPolicy'))}
            className="text-xs text-slate-500 hover:text-indigo-600 underline"
          >
            {t.privacyLink}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
