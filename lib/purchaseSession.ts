export const PURCHASE_TOKEN_KEY = 'vinscanner_purchase_token';

export function readPurchaseToken(): string | null {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem(PURCHASE_TOKEN_KEY) : null;
    return token && token.length >= 10 ? token : null;
  } catch {
    return null;
  }
}

export function persistPurchaseSession(token: string | null): void {
  try {
    if (typeof localStorage !== 'undefined') {
      if (token && token.length >= 10) localStorage.setItem(PURCHASE_TOKEN_KEY, token);
      else localStorage.removeItem(PURCHASE_TOKEN_KEY);
    }
  } catch {}
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('redirect_status')) return;
    if (token && token.length >= 10) url.searchParams.set('token', token);
    else url.searchParams.delete('token');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {}
}

export function clearPurchaseSession(): void {
  persistPurchaseSession(null);
}
