import React, { useState, useEffect } from 'react';

const PENDING_DISCOUNT_KEY = 'vinscanner_pending_discount';

interface DiscountBannerProps {
  t: {
    pricing?: { discountBannerMessage?: string };
    discountWheel?: { getExtraDiscountButton?: string };
  };
  onGetDiscountClick?: () => void;
}

const DiscountBanner: React.FC<DiscountBannerProps> = ({ t, onGetDiscountClick }) => {
  const [pendingDiscount, setPendingDiscount] = useState<{ code: string; percent: number } | null>(null);

  useEffect(() => {
    const readPending = () => {
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PENDING_DISCOUNT_KEY) : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.code && typeof parsed.percent === 'number') {
            setPendingDiscount({ code: parsed.code, percent: parsed.percent });
            return;
          }
        }
      } catch {}
      setPendingDiscount(null);
    };
    readPending();
    window.addEventListener('vinscanner-discount-applied', readPending);
    return () => window.removeEventListener('vinscanner-discount-applied', readPending);
  }, []);

  const buttonLabel = t.discountWheel?.getExtraDiscountButton ?? 'Gauti papildomą nuolaidą!';

  if (pendingDiscount) {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex flex-row flex-nowrap items-center justify-center">
            <p className="text-white font-bold text-xs sm:text-sm md:text-base">
              {(t.pricing?.discountBannerMessage ?? 'Papildoma {percent}% nuolaida bus pritaikyta atsiskaitant').replace('{percent}', String(pendingDiscount.percent))}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!onGetDiscountClick) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-row flex-nowrap items-center justify-center">
          <button
            type="button"
            onClick={onGetDiscountClick}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;
