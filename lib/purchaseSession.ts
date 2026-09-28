export const PURCHASE_TOKEN_KEY = 'vinscanner_purchase_token';
export const LAST_PAYMENT_INTENT_KEY = 'vinscanner_last_payment_intent';
export const PENDING_ORDER_KEY = 'vinscanner_pending_order';

export function readPurchaseToken(): string | null {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem(PURCHASE_TOKEN_KEY) : null;
    return token && token.length >= 10 ? token : null;
  } catch {
    return null;
  }
}

export function readLastPaymentIntent(): string | null {
  try {
    const id = typeof localStorage !== 'undefined' ? localStorage.getItem(LAST_PAYMENT_INTENT_KEY) : null;
    return id && id.startsWith('pi_') ? id : null;
  } catch {
    return null;
  }
}

export function writeLastPaymentIntent(id: string | null): void {
  try {
    if (typeof localStorage === 'undefined') return;
    if (id && id.startsWith('pi_')) localStorage.setItem(LAST_PAYMENT_INTENT_KEY, id);
    else localStorage.removeItem(LAST_PAYMENT_INTENT_KEY);
  } catch {}
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
    if (url.searchParams.get('redirect_status')) {
      url.searchParams.delete('redirect_status');
      url.searchParams.delete('payment_intent');
      url.searchParams.delete('payment_intent_client_secret');
    }
    if (token && token.length >= 10) url.searchParams.set('token', token);
    else url.searchParams.delete('token');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  } catch {}
}

export function clearPurchaseSession(): void {
  persistPurchaseSession(null);
  writeLastPaymentIntent(null);
  try {
    localStorage.removeItem(PENDING_ORDER_KEY);
    sessionStorage.removeItem(PENDING_ORDER_KEY);
  } catch {}
}
