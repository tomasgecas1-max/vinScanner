import React, { useState, useRef, useCallback } from 'react';
import { trackEvent } from '../hooks/useGoogleAnalytics';

const PENDING_DISCOUNT_KEY = 'vinscanner_pending_discount';
const WHEEL_LAST_DAY_KEY = 'vinscanner_wheel_last_day';
const MAX_SPINS = 3;

function getTodayLocal(): string {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

interface DiscountWheelModalProps {
  open: boolean;
  onClose: () => void;
  onApplyDiscount?: () => void;
  t: {
    discountWheel: {
      title: string;
      spin: string;
      spinButton: string;
      spinsOfThree: string;
      codeLabel: string;
      applyDiscount: string;
      close: string;
      nextSpinTomorrow?: string;
    };
    pricing: { paymentDiscount: string };
  };
}

interface WheelSegment {
  percent: number;
  code: string;
}

const WHEEL_SEGMENTS: WheelSegment[] = [
  { percent: 25, code: 'V25A9K' },
  { percent: 5, code: 'X05B2M' },
  { percent: 22, code: 'N22C3P' },
  { percent: 8, code: 'R08D5T' },
  { percent: 23, code: 'W23E9Q' },
  { percent: 10, code: 'Y10F4H' },
  { percent: 20, code: 'Z20G1S' },
  { percent: 12, code: 'K12H8J' },
  { percent: 18, code: 'L18I2U' },
  { percent: 15, code: 'M15J0V' },
];

const SEGMENT_COUNT = WHEEL_SEGMENTS.length;
const DEG_PER_SEGMENT = 360 / SEGMENT_COUNT;
const SPIN_DURATION_MS = 5000;
const EXTRA_ROTATIONS = 4;
const WHEEL_SIZE = 260;
const INNER_SIZE = 170;
const LABEL_RADIUS = (WHEEL_SIZE + INNER_SIZE) / 4;

type SpinResult = { percent: number; code: string };

const DiscountWheelModal: React.FC<DiscountWheelModalProps> = ({ open, onClose, onApplyDiscount, t }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [results, setResults] = useState<SpinResult[]>([]);
  const [limitReached, setLimitReached] = useState(false);
  const [limitChecking, setLimitChecking] = useState(true);
  const spinCount = results.length;
  const allDone = spinCount >= MAX_SPINS;

  const recordSessionUsed = useCallback(() => {
    const today = getTodayLocal();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(WHEEL_LAST_DAY_KEY, today);
    }
    fetch('/api/discount-wheel', { method: 'POST' }).catch(() => {});
  }, []);

  const winningRef = useRef<SpinResult>({ percent: 25, code: '48291' });
  const animIdRef = useRef<number | null>(null);

  const runSpin = useCallback(() => {
    const winIndex = Math.floor(Math.random() * SEGMENT_COUNT);
    const segment = WHEEL_SEGMENTS[winIndex];
    winningRef.current = { percent: segment.percent, code: segment.code };

    setSpinning(true);
    setDisplayIndex(winIndex);

    const startRotation = rotation;
    // Segment winIndex centre at (winIndex+0.5)*DEG. Pointer at top = 0°.
    // After rotate(R), point at angle θ moves to θ+R. We need (winIndex+0.5)*DEG at top → (winIndex+0.5)*DEG + R ≡ 0 (mod 360) → R ≡ -(winIndex+0.5)*DEG.
    const targetTotalDeg = (360 - (winIndex + 0.5) * DEG_PER_SEGMENT + 360) % 360;
    const currentTotalMod = ((startRotation % 360) + 360) % 360;
    const deltaToTarget = (targetTotalDeg - currentTotalMod + 360) % 360;
    const finalDelta = 360 * EXTRA_ROTATIONS + deltaToTarget;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / SPIN_DURATION_MS);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentDelta = easeOut * finalDelta;
      const totalRotation = startRotation + currentDelta;

      if (progress < 1) {
        const normalizedAngle = (360 - (totalRotation % 360) + 360) % 360;
        const segmentAtTop = Math.floor(normalizedAngle / DEG_PER_SEGMENT) % SEGMENT_COUNT;
        setDisplayIndex(segmentAtTop);
        setRotation(totalRotation);
        animIdRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(startRotation + finalDelta);
        setDisplayIndex(winIndex);
        setSpinning(false);
        const result = winningRef.current;
        setResults((prev) => [...prev, result]);
        trackEvent('discount_wheel_spin', { percent: result.percent });
      }
    };
    animIdRef.current = requestAnimationFrame(animate);
  }, [rotation]);

  const handleSpinClick = () => {
    if (spinning || spinCount >= MAX_SPINS) return;
    runSpin();
  };

  const handleApplyDiscount = () => {
    if (results.length === 0) return;
    recordSessionUsed();
    const best = results.reduce((a, b) => (a.percent >= b.percent ? a : b));
    const sum = results.reduce((s, r) => s + r.percent, 0);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PENDING_DISCOUNT_KEY, JSON.stringify({ code: best.code, percent: sum, isWheelTotal: true }));
    }
    window.dispatchEvent(new CustomEvent('vinscanner-discount-applied'));
    onApplyDiscount?.();
    onClose();
  };

  const handleClose = () => {
    if (!spinning) {
      if (results.length > 0) {
        recordSessionUsed();
        const best = results.reduce((a, b) => (a.percent >= b.percent ? a : b));
        const sum = results.reduce((s, r) => s + r.percent, 0);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(PENDING_DISCOUNT_KEY, JSON.stringify({ code: best.code, percent: sum, isWheelTotal: true }));
        }
        window.dispatchEvent(new CustomEvent('vinscanner-discount-applied'));
      }
      onClose();
    }
  };

  React.useEffect(() => {
    if (!open) {
      setSpinning(false);
      setRotation(0);
      setDisplayIndex(0);
      setResults([]);
      setLimitReached(false);
      setLimitChecking(true);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      return;
    }
    let cancelled = false;
    const check = async () => {
      const today = getTodayLocal();
      const lastDay = typeof localStorage !== 'undefined' ? localStorage.getItem(WHEEL_LAST_DAY_KEY) : null;
      if (lastDay === today) {
        if (!cancelled) setLimitReached(true);
        setLimitChecking(false);
        return;
      }
      try {
        const res = await fetch('/api/discount-wheel');
        const data = await res.json();
        if (!cancelled && data?.allowed === false) setLimitReached(true);
      } catch {
        /* API neveikia – naudojamas tik localStorage */
      }
      if (!cancelled) setLimitChecking(false);
    };
    check();
    return () => { cancelled = true; };
  }, [open]);

  const conicStops = WHEEL_SEGMENTS.map((seg, i) => {
    const deg = i * DEG_PER_SEGMENT;
    const nextDeg = (i + 1) * DEG_PER_SEGMENT;
    const color = i % 2 === 0 ? '#c7d2fe' : '#e0e7ff';
    return `${color} ${deg}deg ${nextDeg}deg`;
  }).join(', ');

  const bestResult = results.length > 0 ? results.reduce((a, b) => (a.percent >= b.percent ? a : b)) : null;
  const totalPercent = results.reduce((sum, r) => sum + r.percent, 0);
  const spinButton = t.discountWheel?.spinButton ?? t.discountWheel?.spin ?? 'Spin';
  const spinsOfThree = t.discountWheel?.spinsOfThree ?? 'of 3 spins';
  const nextSpinMsg = t.discountWheel?.nextSpinTomorrow ?? 'Kitas sukimas galimas kitą dieną.';

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 -m-2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={t.discountWheel.close}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>

        <h3 className="text-xl font-black text-slate-900 mb-6">{t.discountWheel.title}</h3>

        {limitReached ? (
          <div className="py-8">
            <p className="text-slate-600 text-center mb-8">{nextSpinMsg}</p>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              {t.discountWheel.close}
            </button>
          </div>
        ) : limitChecking ? (
          <p className="text-slate-500 py-8">...</p>
        ) : (
          <>

        <div className="relative mx-auto mb-4" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
          <div
            className="absolute rounded-full overflow-hidden border-4 border-indigo-100"
            style={{
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
              background: `conic-gradient(from 0deg, ${conicStops})`,
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'none' : 'transform 0.1s',
            }}
          >
            {WHEEL_SEGMENTS.map((seg, i) => {
              const centerAngleDeg = (i + 0.5) * DEG_PER_SEGMENT;
              const angleFromRight = 90 - centerAngleDeg;
              const rad = (angleFromRight * Math.PI) / 180;
              const x = WHEEL_SIZE / 2 + LABEL_RADIUS * Math.cos(rad);
              const y = WHEEL_SIZE / 2 - LABEL_RADIUS * Math.sin(rad);
              const labelRotation = centerAngleDeg;
              return (
                <span
                  key={i}
                  className="absolute text-sm font-black whitespace-nowrap pointer-events-none text-indigo-700"
                  style={{
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%) rotate(${labelRotation}deg)`,
                    textShadow: '0 0 2px white, 0 1px 2px rgba(255,255,255,0.8)',
                  }}
                >
                  {seg.percent}%
                </span>
              );
            })}
          </div>
          <div
            className="absolute rounded-full bg-white border-4 border-slate-200 flex flex-col items-center justify-center shadow-inner cursor-pointer"
            style={{
              width: INNER_SIZE,
              height: INNER_SIZE,
              left: (WHEEL_SIZE - INNER_SIZE) / 2,
              top: (WHEEL_SIZE - INNER_SIZE) / 2,
            }}
            onClick={handleSpinClick}
          >
            {spinning ? (
              <>
                <span className="text-2xl font-black text-indigo-600">
                  {WHEEL_SEGMENTS[displayIndex]?.percent ?? winningRef.current.percent}%
                </span>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  {t.discountWheel.spin}
                </span>
              </>
            ) : (
              <button
                type="button"
                disabled={spinCount >= MAX_SPINS}
                className="w-20 h-20 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 flex flex-col items-center justify-center"
              >
                <span className="text-lg font-black leading-tight">{spinButton}</span>
                <span className="text-[11px] font-semibold text-indigo-100 mt-0.5">{spinCount} / 3</span>
              </button>
            )}
          </div>
          <div
            className="absolute w-0 h-0 z-10 pointer-events-none"
            style={{
              left: '50%',
              top: -6,
              transform: 'translateX(-50%)',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '14px solid #f43f5e',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
            }}
          />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 mb-2 min-h-[2rem]">
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-slate-500 font-bold text-lg leading-10">+</span>}
              <div
                className={`w-14 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                  results[i]
                    ? bestResult && results[i]?.percent === bestResult.percent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                      : 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {results[i] ? `${results[i].percent}%` : '–'}
              </div>
            </React.Fragment>
          ))}
        </div>
        {results.length > 0 && (
          <p className="text-slate-600 text-sm font-bold mb-6">= {totalPercent}%</p>
        )}

        {allDone && bestResult ? (
          <div className="space-y-4">
            <button
              onClick={handleApplyDiscount}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-colors"
            >
              {t.discountWheel.applyDiscount} ({totalPercent}%)
            </button>
          </div>
        ) : null}

        <button
          onClick={handleClose}
          disabled={spinning}
          className="mt-6 w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-60"
        >
          {t.discountWheel.close}
        </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscountWheelModal;
