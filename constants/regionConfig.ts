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

export const REGION_CONFIG: Record<RegionCode, RegionConfig> = {
  default: {
    currency: 'eur',
    symbol: '€',
    prices: [14, 24, 33],
    oldPrices: [28, 48, 66],
  },
  pl: {
    currency: 'pln',
    symbol: 'zł',
    prices: [60, 100, 120],
    oldPrices: [120, 200, 240],
  },
  fr: {
    currency: 'eur',
    symbol: '€',
    prices: [14, 24, 33],
    oldPrices: [28, 48, 66],
  },
  it: {
    currency: 'eur',
    symbol: '€',
    prices: [14, 24, 33],
    oldPrices: [28, 48, 66],
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
