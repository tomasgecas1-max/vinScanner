export const PENDING_DISCOUNT_KEY = 'vinscanner_pending_discount';

export function readPendingDiscountPercent(): number | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_DISCOUNT_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.percent === 'number' && parsed.percent > 0) return parsed.percent;
  } catch {}
  return null;
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
