import { useEffect } from 'react';
import type { Translations } from '../constants/translations';

export function useMetaTags(t: Translations, lang: string) {
  useEffect(() => {
    document.documentElement.lang = lang;
    
    document.title = t.seo.title;
    
    const updateMetaTag = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };
    
    updateMetaTag('meta[name="description"]', t.seo.description);
    
    updateMetaTag('meta[property="og:title"]', t.seo.ogTitle);
    updateMetaTag('meta[property="og:description"]', t.seo.ogDescription);
    
    updateMetaTag('meta[property="twitter:title"]', t.seo.ogTitle);
    updateMetaTag('meta[property="twitter:description"]', t.seo.ogDescription);
    
  }, [t, lang]);
}
