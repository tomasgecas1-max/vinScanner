/**
 * Regionų konfigūracija – valiuta ir kainos.
 * Regionas nustatomas pagal pathname: /pl → pl, kiti → default.
 */
export type RegionCode = 'pl' | 'default';

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
    prices: [60, 100, 140],
    oldPrices: [120, 200, 280],
  },
};

export function getRegionFromPathname(): RegionCode {
  if (typeof window === 'undefined') return 'default';
  const p = window.location.pathname || '';
  return p.startsWith('/pl') ? 'pl' : 'default';
}
