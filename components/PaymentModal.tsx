import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from './StripePaymentForm';

const stripePk = import.meta.env.VITE_STRIPE_PUBLISHABLE as string | undefined;
const stripePromise = stripePk ? loadStripe(stripePk) : null;

const PLAN_PRICES = [14, 20, 26] as const;

const DISCOUNT_CODES: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  VINS10: { type: 'percent', value: 10 },
  VINS15: { type: 'percent', value: 15 },
  VINS5: { type: 'fixed', value: 5 },
  SAVE3: { type: 'fixed', value: 3 },
};

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPay: (vin: string) => void;
  vin: string;
  planIndex: number;
  email?: string;
  t: {
    pricing: {
      paymentTitle: string;
      paymentOrderSummary: string;
      paymentPlan: string;
      paymentVin: string;
      paymentSubtotal: string;
      paymentDiscount: string;
      paymentTotal: string;
      paymentDiscountCode: string;
      paymentDiscountPlaceholder: string;
      paymentApply: string;
      paymentPay: string;
      paymentSecure: string;
      paymentCodeInvalid: string;
      paymentCodeApplied: string;
      paymentApiUnavailable: string;
      paymentFormLoading: string;
      paymentOrPayAnotherWay: string;
      paymentMethod: string;
      paymentCard: string;
      paymentLink: string;
      paymentApplePay: string;
      paymentEmail: string;
      paymentOr: string;
      paymentExpressCheckout: string;
      close: string;
    };
    nav: { services: string };
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  onPay,
  vin,
  planIndex,
  email,
  t,
}) => {
  const [discountInput, setDiscountInput] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [codeError, setCodeError] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'link' | 'apple'>('card');
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Kai Stripe įjungtas – iš karto kuriame PaymentIntent ir rodom Stripe formą kaip pirmą langą
  useEffect(() => {
    if (!open || !stripePromise || !stripePk || !vin) return;
    setStripeError(null);
    setStripeLoading(true);
    const basePrice = PLAN_PRICES[Math.min(planIndex, 2)] ?? 20;
    const discountConfig = appliedCode ? DISCOUNT_CODES[appliedCode.toUpperCase()] : null;
    const discountAmount = discountConfig
      ? discountConfig.type === 'percent'
        ? Math.round((basePrice * discountConfig.value) / 100 * 100) / 100
        : Math.min(discountConfig.value, basePrice - 0.01)
      : 0;
    const amountEur = Math.max(0.01, basePrice - discountAmount);
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountEur, vin, planIndex, email: email ?? '' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setStripeClientSecret(data.clientSecret);
        } else {
          setStripeError(data.error ?? t.pricing.paymentApiUnavailable);
        }
      })
      .catch(() => setStripeError(t.pricing.paymentApiUnavailable))
      .finally(() => setStripeLoading(false));
  }, [open, vin, planIndex, email, stripePk, appliedCode, t.pricing.paymentApiUnavailable]);

  // Uždarius modalą išvalome clientSecret, kad kitą kartą būtų naujas PaymentIntent
  useEffect(() => {
    if (!open) {
      setStripeClientSecret(null);
      setStripeError(null);
    }
  }, [open]);

  if (!open) return null;

  const isLt = t.nav.services === 'Paslaugos';
  const planNames = isLt
    ? ['Vienkartinė (1 ataskaita)', 'Populiariausias (2 ataskaitos)', 'Geriausia vertė (3 ataskaitos)']
    : ['Single (1 report)', 'Most Popular (2 reports)', 'Best Value (3 reports)'];

  const basePrice = PLAN_PRICES[Math.min(planIndex, 2)] ?? 20;
  const planName = planNames[Math.min(planIndex, 2)] ?? planNames[1];

  const discountConfig = appliedCode ? DISCOUNT_CODES[appliedCode.toUpperCase()] : null;
  const discountAmount = discountConfig
    ? discountConfig.type === 'percent'
      ? Math.round((basePrice * discountConfig.value) / 100 * 100) / 100
      : Math.min(discountConfig.value, basePrice - 0.01)
    : 0;
  const total = Math.max(0.01, basePrice - discountAmount);

  const handleApplyCode = () => {
    const code = discountInput.trim().toUpperCase();
    if (!code) {
      setAppliedCode(null);
      setCodeError(false);
      return;
    }
    if (DISCOUNT_CODES[code]) {
      setAppliedCode(code);
      setCodeError(false);
    } else {
      setAppliedCode(null);
      setCodeError(true);
    }
  };

  const handlePay = async () => {
    if (stripePromise && stripePk) {
      setStripeLoading(true);
      setStripeError(null);
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountEur: total,
            vin,
            planIndex,
            email: email ?? '',
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const msg = res.status === 404 || res.status === 502 ? t.pricing.paymentApiUnavailable : (data.error ?? 'Failed to create payment');
          setStripeError(msg);
          setStripeLoading(false);
          return;
        }
        setStripeClientSecret(data.clientSecret);
      } catch (e) {
        setStripeError(t.pricing.paymentApiUnavailable);
      }
      setStripeLoading(false);
      return;
    }
    onPay(vin);
    onClose();
    setDiscountInput('');
    setAppliedCode(null);
    setCodeError(false);
  };

  const handleStripeSuccess = () => {
    setStripeClientSecret(null);
    setStripeError(null);
    setDiscountInput('');
    setAppliedCode(null);
    onPay(vin);
    onClose();
  };

  const handleStripeBack = () => {
    setStripeClientSecret(null);
    setStripeError(null);
  };

  const orderSummaryBlock = (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">{t.pricing.paymentOrderSummary}</h4>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">{t.pricing.paymentPlan}</span>
          <span className="font-semibold text-slate-900">{planName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">{t.pricing.paymentVin}</span>
          <span className="font-mono font-semibold text-slate-900">{vin}</span>
        </div>
        <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between">
          <span className="text-slate-600">{t.pricing.paymentSubtotal}</span>
          <span className="font-semibold text-slate-900">{basePrice.toFixed(2)} €</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>{t.pricing.paymentDiscount} ({appliedCode})</span>
            <span className="font-semibold">−{discountAmount.toFixed(2)} €</span>
          </div>
        )}
        <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
          <span>{t.pricing.paymentTotal}</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );

  const expressButtons = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.43.07 1.56-.41 3.11-1.14 3.94z"/></svg>
          {t.pricing.paymentApplePay}
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          {t.pricing.paymentLink}
        </button>
      </div>
    </div>
  );

  const paymentMethodBlock = (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.pricing.paymentMethod}</h4>
      <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/50">
        <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-indigo-600" />
        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
        </span>
        <span className="font-semibold text-slate-900">{t.pricing.paymentCard}</span>
        <span className="ml-auto flex gap-1 text-[10px] font-black text-slate-400">VISA</span>
        <span className="text-[10px] font-black text-slate-400">MC</span>
      </label>
    </div>
  );

  const discountBlock = (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-2">{t.pricing.paymentDiscountCode}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={discountInput}
          onChange={(e) => { setDiscountInput(e.target.value); setCodeError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCode())}
          placeholder={t.pricing.paymentDiscountPlaceholder}
          className={`flex-1 px-4 py-3 rounded-xl border-2 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
            codeError ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
          }`}
        />
        <button type="button" onClick={handleApplyCode} className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0">
          {t.pricing.paymentApply}
        </button>
      </div>
      {codeError && <p className="mt-2 text-xs font-medium text-rose-600">{t.pricing.paymentCodeInvalid}</p>}
      {appliedCode && !codeError && <p className="mt-2 text-xs font-medium text-emerald-600">{t.pricing.paymentCodeApplied}</p>}
    </div>
  );

  const secureBlock = (
    <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <p className="text-xs font-medium text-slate-600">{t.pricing.paymentSecure}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-black text-slate-900">{t.pricing.paymentTitle}</h3>
          <button type="button" onClick={onClose} className="p-2 -m-2 text-slate-400 hover:text-slate-600 rounded-lg" aria-label={t.pricing.close}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {stripeClientSecret && stripePromise && (
          <div className="p-6 md:p-8 relative z-[2] bg-white" style={{ pointerEvents: 'auto' }}>
            {email && (
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t.pricing.paymentEmail}</span>
                <p className="text-sm font-medium text-slate-700 mt-1">{email}</p>
              </div>
            )}
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{t.pricing.paymentExpressCheckout}</p>
            {stripeError && (
              <p className="mb-4 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{stripeError}</p>
            )}
            <div className="relative z-[2] min-h-[280px]">
              <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }} key={stripeClientSecret}>
                <StripePaymentForm
                onSuccess={handleStripeSuccess}
                onBack={handleStripeBack}
                totalFormatted={`${total.toFixed(2)} €`}
                payLabel={t.pricing.paymentPay}
                closeLabel={t.pricing.close}
              />
              </Elements>
            </div>
            {discountBlock}
            <div className="mt-6">{orderSummaryBlock}</div>
          </div>
        )}

        {stripePk && stripeLoading && !stripeClientSecret && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[280px]">
            <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-600">{t.pricing.paymentFormLoading}</p>
          </div>
        )}

        {!stripePk && (
        <>
        {/* Mobile: single column */}
        <div className="md:hidden p-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 p-4 bg-white">
            <p className="text-slate-500 text-sm font-medium">{planName}</p>
            <p className="font-mono text-slate-900 font-bold text-lg">{vin}</p>
            <p className="text-xl font-black text-slate-900 mt-1">{total.toFixed(2)} €</p>
          </div>

          {expressButtons}

          <p className="text-center text-sm text-slate-500">{t.pricing.paymentOrPayAnotherWay}</p>

          {email && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{t.pricing.paymentEmail}</label>
              <p className="text-sm font-medium text-slate-700">{email}</p>
            </div>
          )}

          {paymentMethodBlock}
          {discountBlock}
          {secureBlock}

          {stripeError && (
            <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{stripeError}</p>
          )}
          <button
            type="button"
            onClick={handlePay}
            disabled={stripeLoading}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/30 disabled:opacity-50"
          >
            {stripeLoading ? '…' : `${t.pricing.paymentPay} ${total.toFixed(2)} €`}
          </button>
        </div>

        {/* Desktop: two columns */}
        <div className="hidden md:grid md:grid-cols-[1fr,340px] md:min-h-[480px]">
          <div className="p-8 border-r border-slate-100 space-y-6">
            {email && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{t.pricing.paymentEmail}</label>
                <p className="text-sm font-medium text-slate-700 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">{email}</p>
              </div>
            )}

            {expressButtons}
            <p className="text-center text-sm text-slate-500">{t.pricing.paymentOr}</p>
            {paymentMethodBlock}
            {discountBlock}
            {secureBlock}

            {stripeError && (
              <p className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">{stripeError}</p>
            )}
            <button
            type="button"
            onClick={handlePay}
            disabled={stripeLoading}
            className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50"
          >
            {stripeLoading ? '…' : `${t.pricing.paymentPay} ${total.toFixed(2)} €`}
          </button>
          </div>
          <div className="p-8 bg-slate-50/50">
            {orderSummaryBlock}
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
