import React, { useState, useEffect } from 'react';
import { ALL_LANGUAGES, type LangCode } from '../constants/translations';

interface LanguageSelectionBarProps {
  onSelect: (lang: LangCode) => void;
  onDismiss: () => void;
}

const COUNTRY_TO_LANG: Record<string, LangCode> = {
  LT: 'lt', LV: 'lv', EE: 'et',
  PL: 'pl', DE: 'de', AT: 'de', CH: 'de',
  FR: 'fr', BE: 'fr',
  ES: 'es', MX: 'es', AR: 'es',
  IT: 'it', NL: 'nl',
  CZ: 'cs', SK: 'sk',
  UA: 'uk', RO: 'ro',
  SE: 'sv', NO: 'no', DK: 'da', FI: 'fi',
  GR: 'el', PT: 'pt', BR: 'pt',
  HU: 'hu', BG: 'bg', RS: 'sr',
  HR: 'hr', BA: 'bs', SI: 'sl',
  AL: 'sq', MK: 'mk', ME: 'cnr',
  TR: 'tr', IS: 'is', LU: 'lb', MT: 'mt',
  GB: 'en', US: 'en', IE: 'en', AU: 'en', NZ: 'en', CA: 'en',
};

function getLangInfo(code: LangCode) {
  return ALL_LANGUAGES.find((x) => x.code === code) ?? ALL_LANGUAGES.find((x) => x.code === 'en')!;
}

const LanguageSelectionBar: React.FC<LanguageSelectionBarProps> = ({ onSelect, onDismiss }) => {
  const [detectedLang, setDetectedLang] = useState<LangCode | null>(null);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country_code?.toUpperCase();
          if (countryCode && COUNTRY_TO_LANG[countryCode]) {
            setDetectedLang(COUNTRY_TO_LANG[countryCode]);
          }
        }
      } catch {
        // Fallback - no detection
      } finally {
        setLoading(false);
      }
    };
    detectLanguage();
  }, []);

  const handleSelect = (lang: LangCode) => {
    localStorage.setItem('vinscanner_lang_selected', 'true');
    localStorage.setItem('vinscanner_lang', lang);
    onSelect(lang);
  };

  const detectedInfo = detectedLang ? getLangInfo(detectedLang) : null;
  const englishInfo = getLangInfo('en');
  const otherLanguages = ALL_LANGUAGES.filter(
    (l) => l.code !== detectedLang && l.code !== 'en'
  );

  return (
    <div className="fixed top-20 left-0 right-0 z-[90] bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: Globe icon */}
          <div className="flex items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
          </div>

          {/* Center: Language buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {/* Detected language */}
                {detectedInfo && detectedLang !== 'en' && (
                  <button
                    onClick={() => handleSelect(detectedLang)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    <span className="text-lg">{detectedInfo.flag}</span>
                    <span>{detectedInfo.native}</span>
                  </button>
                )}

                {/* English */}
                <button
                  onClick={() => handleSelect('en')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  <span className="text-lg">{englishInfo.flag}</span>
                  <span>{englishInfo.native}</span>
                </button>

                {/* Other languages dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowAllLanguages(!showAllLanguages)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/90 text-sm font-medium transition-colors"
                  >
                    <span>Other</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showAllLanguages ? 'rotate-180' : ''}`}>
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>

                  {showAllLanguages && (
                    <div className="absolute top-full right-0 mt-2 w-[280px] sm:w-[400px] max-h-[300px] overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-100 p-2 z-50 grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {otherLanguages.map((item) => (
                        <button
                          key={item.code}
                          onClick={() => handleSelect(item.code)}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                        >
                          <span className="text-lg">{item.flag}</span>
                          <span className="text-sm font-medium text-slate-700 truncate">{item.native}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: Close button */}
          <button
            onClick={onDismiss}
            className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-colors"
            title="Dismiss"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionBar;
