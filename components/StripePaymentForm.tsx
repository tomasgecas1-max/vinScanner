import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PENDING_ORDER_KEY = 'vinscanner_pending_order';

interface StripePaymentFormProps {
  onSuccess: () => void;
  onBack: () => void;
  totalFormatted: string;
  payLabel: string;
  closeLabel: string;
  pendingVin?: string;
  pendingEmail?: string;
  pendingPlanIndex?: number;
  /** Kalba, kurią vartotojas pasirinko – išsaugoma ir naudojama el. laiškui grįžus iš mokėjimo */
  pendingLang?: string;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  onSuccess,
  onBack,
  totalFormatted,
  payLabel,
  closeLabel,
  pendingVin,
  pendingEmail,
  pendingPlanIndex,
  pendingLang,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    try {
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify({
        vin: (pendingVin && pendingVin.trim()) || 'PENDING',
        email: pendingEmail ?? '',
        planIndex: pendingPlanIndex ?? 0,
        lang: pendingLang ?? undefined,
      }));
    } catch (_) {}
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/',
      },
    });
    setLoading(false);
    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed');
      return;
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="min-h-[220px] w-full relative z-[10] isolate bg-white rounded-xl border border-slate-200 p-4" style={{ pointerEvents: 'auto' }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          {closeLabel}
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? '…' : `${payLabel} ${totalFormatted}`}
        </button>
      </div>
    </form>
  );
};
