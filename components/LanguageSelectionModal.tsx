import React, { useState, useEffect } from 'react';
import { ALL_LANGUAGES, type LangCode } from '../constants/translations';

interface LanguageSelectionModalProps {
  onSelect: (lang: LangCode) => void;
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

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({ onSelect }) => {
  const [detectedLang, setDetectedLang] = useState<LangCode | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country_code?.toUpperCase();
          setDetectedCountry(data.country_name || countryCode);
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
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-6 sm:p-8 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
              <path d="M2 12h20"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Select Your Language</h2>
          <p className="text-white/80 text-sm">Pasirinkite kalbą / Wählen Sie Ihre Sprache</p>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Detected language */}
              {detectedInfo && detectedLang !== 'en' && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {detectedCountry ? `Detected: ${detectedCountry}` : 'Recommended'}
                  </p>
                  <button
                    onClick={() => handleSelect(detectedLang)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200 transition-all group"
                  >
                    <span className="text-3xl">{detectedInfo.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{detectedInfo.name}</div>
                      <div className="text-xs text-slate-500">{detectedInfo.native}</div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              )}

              {/* English option */}
              <div>
                {detectedInfo && detectedLang !== 'en' && (
                  <p className="text-xs text-slate-500 font-medium mb-2">English</p>
                )}
                <button
                  onClick={() => handleSelect('en')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${
                    !detectedInfo || detectedLang === 'en'
                      ? 'border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200'
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="text-3xl">{englishInfo.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{englishInfo.name}</div>
                    <div className="text-xs text-slate-500">{englishInfo.native}</div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-hover:translate-x-1 transition-transform">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>

              {/* Other languages toggle */}
              <div>
                <button
                  onClick={() => setShowAllLanguages(!showAllLanguages)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <span>{showAllLanguages ? 'Hide other languages' : 'Other languages'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showAllLanguages ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                {showAllLanguages && (
                  <div className="grid grid-cols-2 gap-2 mt-3 max-h-[240px] overflow-y-auto pr-1">
                    {otherLanguages.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => handleSelect(item.code)}
                        className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all text-left"
                      >
                        <span className="text-xl">{item.flag}</span>
                        <span className="text-sm font-medium text-slate-700 truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionModal;
