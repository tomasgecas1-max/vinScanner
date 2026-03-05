import { useEffect } from 'react';
import type { Translations } from '../constants/translations';

const OG_LOCALE: Record<string, string> = {
  lt: 'lt_LT', en: 'en_US', de: 'de_DE', pl: 'pl_PL', fr: 'fr_FR', es: 'es_ES', it: 'it_IT',
  nl: 'nl_NL', cs: 'cs_CZ', uk: 'uk_UA', ro: 'ro_RO', sv: 'sv_SE', el: 'el_GR', pt: 'pt_PT',
  hu: 'hu_HU', bg: 'bg_BG', sr: 'sr_RS', da: 'da_DK', no: 'nb_NO', fi: 'fi_FI', sk: 'sk_SK',
  hr: 'hr_HR', bs: 'bs_BA', sq: 'sq_AL', sl: 'sl_SI', lv: 'lv_LV', mk: 'mk_MK', et: 'et_EE',
  ca: 'ca_ES', lb: 'lb_LU', cnr: 'sr_ME', mt: 'mt_MT', is: 'is_IS', tr: 'tr_TR',
};

export function useMetaTags(t: Translations, lang: string) {
  useEffect(() => {
    document.documentElement.lang = lang;

    document.title = t.seo.title;

    const updateMetaTag = (selector: string, content: string, attr = 'content') => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, content);
    };

    updateMetaTag('meta[name="description"]', t.seo.description);
    updateMetaTag('meta[property="og:title"]', t.seo.ogTitle);
    updateMetaTag('meta[property="og:description"]', t.seo.ogDescription);
    updateMetaTag('meta[property="og:url"]', 'https://vinscanner.eu/');
    const locale = OG_LOCALE[lang] || 'en_US';
    updateMetaTag('meta[property="og:locale"]', locale);

    updateMetaTag('meta[name="twitter:title"]', t.seo.ogTitle);
    updateMetaTag('meta[name="twitter:description"]', t.seo.ogDescription);
  }, [t, lang]);
}
