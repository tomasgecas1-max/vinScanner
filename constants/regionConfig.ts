/**
 * Regionų konfigūracija – valiuta ir kainos.
 * Regionas nustatomas pagal pathname: /pl → pl, /fr → fr, /it → it, kiti → default.
 */
export type RegionCode = 'pl' | 'fr' | 'it' | 'default';

/** Visi regionai – naudoti masiniams pakeitimams (default, pl, fr, it) */
export const REGIONS: RegionCode[] = ['default', 'pl', 'fr', 'it'];

export interface RegionConfig {
  currency: 'eur' | 'pln';
  symbol: string;
  /** Kainos planams [1 ataskaita, 2, 3] */
  prices: [number, number, number];
  /** Kainos su nuolaida (senoji kaina) [1, 2, 3] */
  oldPrices: [number, number, number];
}

/** Laikinai sumažintos kainos (per pusę) */
export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  default: {
    currency: 'eur',
    symbol: '€',
    prices: [7, 12, 17],
    oldPrices: [14, 24, 33],
  },
  pl: {
    currency: 'pln',
    symbol: 'zł',
    prices: [30, 50, 60],
    oldPrices: [60, 100, 120],
  },
  fr: {
    currency: 'eur',
    symbol: '€',
    prices: [7, 12, 17],
    oldPrices: [14, 24, 33],
  },
  it: {
    currency: 'eur',
    symbol: '€',
    prices: [7, 12, 17],
    oldPrices: [14, 24, 33],
  },
};

export function getRegionFromPathname(): RegionCode {
  if (typeof window === 'undefined') return 'default';
  const p = window.location.pathname || '';
  if (p.startsWith('/pl')) return 'pl';
  if (p.startsWith('/fr')) return 'fr';
  if (p.startsWith('/it')) return 'it';
  return 'default';
}
