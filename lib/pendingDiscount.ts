export const PENDING_DISCOUNT_KEY = 'vinscanner_pending_discount';

export function readPendingDiscount(): { percent: number; active: boolean } | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_DISCOUNT_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.percent === 'number' && parsed.percent > 0) {
      return { percent: parsed.percent, active: parsed.active === true };
    }
  } catch {}
  return null;
}

export function readPendingDiscountPercent(): number | null {
  return readPendingDiscount()?.percent ?? null;
}

export function setPendingDiscountActive(active: boolean): void {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_DISCOUNT_KEY) : null;
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.percent !== 'number') return;
    localStorage.setItem(PENDING_DISCOUNT_KEY, JSON.stringify({ ...parsed, active }));
    window.dispatchEvent(new CustomEvent('vinscanner-discount-applied'));
  } catch {}
}

/** Ta pati formulė kaip PaymentModal – kad kortelių kainos sutaptų su Stripe. */
export function priceAfterDiscount(basePrice: number, percent: number | null): number {
  if (!percent) return basePrice;
  const discountAmount = Math.round(((basePrice * percent) / 100) * 100) / 100;
  return Math.max(0.01, Math.round((basePrice - discountAmount) * 100) / 100);
}

export function formatPlanPrice(price: number, hasDiscount: boolean): string {
  return hasDiscount ? price.toFixed(2) : String(price);
}
