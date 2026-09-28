export const PENDING_DISCOUNT_KEY = 'vinscanner_pending_discount';
export const WHEEL_LAST_DAY_KEY = 'vinscanner_wheel_last_day';

export type PendingDiscount = {
  code: string;
  percent: number;
  isWheelTotal: boolean;
  activePlans: [boolean, boolean, boolean];
};

export function getTodayLocal(): string {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

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

function savedDayOf(parsed: { savedDay?: string }): string | null {
  if (typeof parsed.savedDay === 'string' && parsed.savedDay) return parsed.savedDay;
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(WHEEL_LAST_DAY_KEY) : null;
  } catch {
    return null;
  }
}

function isExpired(parsed: { savedDay?: string }): boolean {
  const day = savedDayOf(parsed);
  if (!day) return true;
  return day !== getTodayLocal();
}

function clearExpiredDiscount(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(PENDING_DISCOUNT_KEY);
    const lastDay = localStorage.getItem(WHEEL_LAST_DAY_KEY);
    if (lastDay && lastDay !== getTodayLocal()) {
      localStorage.removeItem(WHEEL_LAST_DAY_KEY);
    }
  } catch {}
}

export function hasSpunToday(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(WHEEL_LAST_DAY_KEY) === getTodayLocal();
  } catch {
    return false;
  }
}

export function readPendingDiscount(): PendingDiscount | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_DISCOUNT_KEY) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.percent === 'number' && parsed.percent > 0) {
      if (isExpired(parsed)) {
        clearExpiredDiscount();
        return null;
      }
      return {
        percent: parsed.percent,
        code: typeof parsed.code === 'string' ? parsed.code : '',
        isWheelTotal: parsed.isWheelTotal === true,
        activePlans: normalizeActivePlans(parsed),
      };
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

export function saveWheelDiscount(won: { code: string; percent: number }): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const today = getTodayLocal();
    localStorage.setItem(WHEEL_LAST_DAY_KEY, today);
    localStorage.setItem(PENDING_DISCOUNT_KEY, JSON.stringify({
      code: won.code,
      percent: won.percent,
      isWheelTotal: true,
      activePlans: [false, false, false],
      active: false,
      savedDay: today,
    }));
    window.dispatchEvent(new CustomEvent('vinscanner-discount-applied'));
  } catch {}
}

export function activatePlanDiscount(planIndex: number): void {
  try {
    const pending = readPendingDiscount();
    if (!pending || pending.activePlans[planIndex]) return;
    const raw = localStorage.getItem(PENDING_DISCOUNT_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const activePlans = [...pending.activePlans] as [boolean, boolean, boolean];
    activePlans[planIndex] = true;
    localStorage.setItem(PENDING_DISCOUNT_KEY, JSON.stringify({
      ...parsed,
      activePlans,
      active: true,
      savedDay: parsed.savedDay || getTodayLocal(),
    }));
    window.dispatchEvent(new CustomEvent('vinscanner-discount-applied'));
  } catch {}
}

export function subscribePendingDiscount(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener('vinscanner-discount-applied', handler);
  window.addEventListener('focus', handler);
  document.addEventListener('visibilitychange', handler);
  return () => {
    window.removeEventListener('vinscanner-discount-applied', handler);
    window.removeEventListener('focus', handler);
    document.removeEventListener('visibilitychange', handler);
  };
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
