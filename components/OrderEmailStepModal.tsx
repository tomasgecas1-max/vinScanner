import React, { useState } from 'react';

interface OrderEmailStepModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (vin: string, email: string) => void;
  pendingVin: string;
  t: {
    pricing: {
      orderStepTitle: string;
      orderStepEmailLabel: string;
      orderStepEmailPlaceholder: string;
      orderStepAgreeTerms: string;
      orderStepAgreeBeforeTerms: string;
      orderStepTermsLink: string;
      orderStepAgreeBetween: string;
      orderStepPrivacyLink: string;
      orderStepTermsText: string;
      orderStepPrivacyText: string;
      orderStepContinue: string;
      close: string;
    };
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OrderEmailStepModal: React.FC<OrderEmailStepModalProps> = ({
  open,
  onClose,
  onConfirm,
  pendingVin,
  t,
}) => {
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [infoModal, setInfoModal] = useState<'terms' | 'privacy' | null>(null);

  if (!open) return null;

  const emailValid = EMAIL_REGEX.test(email.trim());
  const canContinue = emailValid && agreeTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue) return;
    onConfirm(pendingVin, email.trim());
    setEmail('');
    setAgreeTerms(false);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-black text-slate-900 mb-6">
          {t.pricing.orderStepTitle}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="order-email" className="block text-sm font-bold text-slate-700 mb-2">
              {t.pricing.orderStepEmailLabel}
            </label>
            <input
              id="order-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.pricing.orderStepEmailPlaceholder}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              autoComplete="email"
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
            />
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              {t.pricing.orderStepAgreeBeforeTerms}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setInfoModal('terms'); }}
                className="font-bold text-indigo-600 underline underline-offset-2 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 rounded px-0.5"
              >
                {t.pricing.orderStepTermsLink}
              </button>
              {t.pricing.orderStepAgreeBetween}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setInfoModal('privacy'); }}
                className="font-bold text-indigo-600 underline underline-offset-2 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 rounded px-0.5"
              >
                {t.pricing.orderStepPrivacyLink}
              </button>
            </span>
          </label>
          {infoModal && (
            <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setInfoModal(null)}>
              <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-lg font-black text-slate-900 mb-4">
                  {infoModal === 'terms' ? t.pricing.orderStepTermsLink : t.pricing.orderStepPrivacyLink}
                </h4>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  {infoModal === 'terms' ? t.pricing.orderStepTermsText : t.pricing.orderStepPrivacyText}
                </p>
                <button
                  type="button"
                  onClick={() => setInfoModal(null)}
                  className="mt-6 w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  {t.pricing.close}
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {t.pricing.close}
            </button>
            <button
              type="submit"
              disabled={!canContinue}
              className="flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t.pricing.orderStepContinue}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderEmailStepModal;
