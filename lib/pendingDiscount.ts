export const PENDING_DISCOUNT_KEY = 'vinscanner_pending_discount';

function emptyActivePlans(): [boolean, boolean, boolean] {
  return [false, false, false];
}

function normalizeActivePlans(parsed: { active?: boolean; activePlans?: boolean[] }): [boolean, boolean, boolean] {
  if (Array.isArray(parsed.activePlans) && parsed.activePlans.length === 3) {
    return [!!parsed.activePlans[0], !!parsed.activePlans[1], !!parsed.activePlans[2]];
  }
  if (parsed.active === true) return [true, true, true];
  return emptyActivePlans();
}

export function readPendingDiscount(): { percent: number; activePlans: [boolean, boolean, boolean] } | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_DISCOUNT_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.percent === 'number' && parsed.percent > 0) {
      return { percent: parsed.percent, activePlans: normalizeActivePlans(parsed) };
    }
  } catch {}
  return null;
}

export function readPendingDiscountPercent(): number | null {
  return readPendingDiscount()?.percent ?? null;
}

export function isPlanDiscountActive(planIndex: number): boolean {
  const pending = readPendingDiscount();
  if (!pending) return false;
  return pending.activePlans[planIndex] === true;
}

export function activatePlanDiscount(planIndex: number): void {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_DISCOUNT_KEY) : null;
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.percent !== 'number') return;
    const activePlans = normalizeActivePlans(parsed);
    if (activePlans[planIndex]) return;
    activePlans[planIndex] = true;
    localStorage.setItem(PENDING_DISCOUNT_KEY, JSON.stringify({ ...parsed, activePlans, active: activePlans.some(Boolean) }));
    window.dispatchEvent(new CustomEvent('vinscanner-discount-applied'));
  } catch {}
}

/** Ta pati formulė kaip PaymentModal – kad kortelių kainos sutaptų su Stripe. */
export function discountAmount(basePrice: number, percent: number | null): number {
  if (!percent) return 0;
  return Math.round(((basePrice * percent) / 100) * 100) / 100;
}

export function priceAfterDiscount(basePrice: number, percent: number | null): number {
  if (!percent) return basePrice;
  return Math.max(0.01, Math.round((basePrice - discountAmount(basePrice, percent)) * 100) / 100);
}

export function formatPlanPrice(price: number, hasDiscount: boolean): string {
  return hasDiscount ? price.toFixed(2) : String(price);
}
