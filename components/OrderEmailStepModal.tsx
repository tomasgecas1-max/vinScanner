import React, { useState, useEffect } from 'react';
import { PRIVACY_POLICY } from '../content/privacy-policy';
import type { LangCode } from '../constants/translations';

function formatPolicyText(text: string): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const bold = (s: string) => s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const lines = text.trim().split('\n');
  let inTable = false;
  let tableHtml = '';
  const out: string[] = [];
  const flushTable = () => {
    if (inTable && tableHtml) {
      out.push(`<div class="overflow-x-auto my-4"><table class="min-w-full text-sm border border-slate-200 rounded-lg">${tableHtml}</table></div>`);
      tableHtml = '';
      inTable = false;
    }
  };
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('|') && t.endsWith('|')) {
      if (t.includes('---')) continue;
      inTable = true;
      const cells = t.split('|').slice(1, -1).map((c) => bold(escape(c.trim())));
      const tag = !tableHtml ? 'th' : 'td';
      tableHtml += `<tr>${cells.map((c) => `<${tag} class="border border-slate-200 px-3 py-2 text-left">${c}</${tag}>`).join('')}</tr>`;
      continue;
    }
    flushTable();
    if (t.startsWith('**') && t.endsWith('**'))
      out.push(`<p class="font-bold text-slate-900 mt-4 mb-1">${escape(t.slice(2, -2))}</p>`);
    else if (t) out.push(`<p class="text-slate-600 text-sm font-medium leading-relaxed mb-2">${bold(escape(t))}</p>`);
  }
  flushTable();
  return out.join('');
}

interface OrderEmailStepModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (vin: string, email: string) => void;
  pendingVin: string;
  defaultEmail?: string;
  lang?: LangCode;
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
  defaultEmail,
  lang = 'lt',
  t,
}) => {
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [infoModal, setInfoModal] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    if (open && defaultEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(defaultEmail)) {
      setEmail(defaultEmail);
    } else if (!open) {
      setEmail('');
      setAgreeTerms(false);
    }
  }, [open, defaultEmail]);

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
                className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-lg font-black text-slate-900 mb-4 shrink-0">
                  {infoModal === 'terms' ? t.pricing.orderStepTermsLink : t.pricing.orderStepPrivacyLink}
                </h4>
                <div className="overflow-y-auto flex-1 pr-2 [&_strong]:font-bold [&_strong]:text-slate-900">
                  {infoModal === 'privacy' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatPolicyText(PRIVACY_POLICY[lang === 'lt' || lang === 'en' || lang === 'de' ? lang : 'en']) }} />
                  ) : (
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{t.pricing.orderStepTermsText}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setInfoModal(null)}
                  className="mt-6 w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-colors shrink-0"
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
