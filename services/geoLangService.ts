/**
 * Šalis pagal IP → kalba (ISO 3166-1 alpha-2 → LangCode)
 * Naudoja ipapi.co (nemokamai, be API key)
 */
import type { LangCode } from '../constants/translations';

const COUNTRY_TO_LANG: Record<string, LangCode> = {
  LT: 'lt', DE: 'de', PL: 'pl', FR: 'fr', ES: 'es', IT: 'it', NL: 'nl',
  CZ: 'cs', UA: 'uk', RO: 'ro', SE: 'sv', GR: 'el', PT: 'pt', HU: 'hu',
  BG: 'bg', RS: 'sr', DK: 'da', NO: 'no', FI: 'fi', SK: 'sk', HR: 'hr',
  BA: 'bs', AL: 'sq', SI: 'sl', LV: 'lv', MK: 'mk', EE: 'et', LU: 'lb',
  ME: 'cnr', MT: 'mt', IS: 'is', TR: 'tr', GB: 'en', US: 'en', IE: 'en',
  AU: 'en', CA: 'en', NZ: 'en', AT: 'de', CH: 'de', BE: 'nl', AD: 'ca',
};

const SUPPORTED_LANGS = new Set<string>(Object.values(COUNTRY_TO_LANG));

export async function getLangFromIp(): Promise<LangCode | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch('https://ipapi.co/json/', { signal: ctrl.signal });
    clearTimeout(t);
    const data = await res.json();
    const cc = (data.country_code as string)?.toUpperCase?.();
    if (!cc) return null;
    const lang = COUNTRY_TO_LANG[cc];
    return lang && SUPPORTED_LANGS.has(lang) ? lang : null;
  } catch {
    return null;
  }
}
