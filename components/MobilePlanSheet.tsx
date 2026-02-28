import React from 'react';

interface MobilePlanSheetProps {
  pendingVin: string;
  t: { pricing: { selectPlanForVin: string; order: string; confirm: string; bestValue: string; close: string; refundPolicy: string; refundPolicyText: string; perReport: string; planSingle: string; planPopular: string; planBestValue: string; report1: string; reports2: string; reports3: string }; nav: { services: string } };
  onPlanSelect: (vin: string, planIndex: number) => void;
  onClose: () => void;
}

const MobilePlanSheet: React.FC<MobilePlanSheetProps> = ({ pendingVin, t, onPlanSelect, onClose }) => {
  const [selectedIdx, setSelectedIdx] = React.useState<number>(1);
  const [refundModalOpen, setRefundModalOpen] = React.useState(false);
  const plans = [
    // TESTAVIMUI: kainos sumažintos iki 0.50 EUR (grąžinti prieš production!)
    { name: t.pricing.planSingle, count: t.pricing.report1, price: 0.50, oldPrice: 1.00, highlight: false },
    { name: t.pricing.planPopular, count: t.pricing.reports2, price: 0.50, oldPrice: 1.00, highlight: false },
    { name: t.pricing.planBestValue, count: t.pricing.reports3, price: 0.50, oldPrice: 1.00, highlight: true },
  ];

  const handleConfirm = () => {
    onPlanSelect(pendingVin, selectedIdx);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center px-3 py-4 md:hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[min(calc(100vw-24px),100%)] bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="relative px-6 pt-6 pb-4 flex items-center justify-center">
          <h3 className="text-xl font-black text-slate-900 text-center pr-10">
            {t.pricing.selectPlanForVin}
          </h3>
          <button onClick={onClose} className="absolute right-4 top-6 p-2 -m-2 text-slate-400 hover:text-slate-600" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="px-4 pb-6">
          <p className="text-slate-500 text-sm font-medium mb-4 font-mono truncate">{pendingVin}</p>
          <div className="grid grid-cols-3 gap-3 items-stretch">
            {plans.map((plan, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`flex flex-col items-center justify-center min-h-[120px] min-w-0 p-2 rounded-2xl border-2 transition-all duration-300 ease-out bg-white text-slate-900 border-slate-200 shadow-xl shadow-slate-200/50 ${
                  selectedIdx === idx
                    ? 'scale-[1.22] z-10 border-indigo-600 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.25)]'
                    : 'scale-100'
                } hover:border-indigo-300`}
              >
                <div
                  className="font-black mb-1 tracking-tight uppercase text-indigo-600 text-center w-full leading-tight whitespace-nowrap min-w-0"
                  style={{ fontSize: 'clamp(0.65rem, 3.2vw, 0.95rem)' }}
                >
                  {plan.count}
                </div>
                <div className="text-[9px] font-medium text-slate-900 lowercase mb-1.5 leading-tight text-center break-words w-full min-w-0">
                  ({plan.name.toLowerCase()})
                </div>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="text-lg font-black tracking-tighter text-slate-900">{plan.price} €</span>
                  <span className="text-[10px] text-slate-400 line-through decoration-rose-500/50 font-bold">{plan.oldPrice} €</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-1">
                  {t.pricing.perReport} {Number.isInteger(plan.price / (idx + 1)) ? plan.price / (idx + 1) : (plan.price / (idx + 1)).toFixed(1)} €
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleConfirm}
            className="mt-6 w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] bg-slate-900 text-white shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800"
          >
            {t.pricing.order}
          </button>
          <button
            onClick={() => setRefundModalOpen(true)}
            className="mt-3 text-[10px] font-bold text-slate-500 hover:text-indigo-600 underline underline-offset-2 transition-colors"
          >
            {t.pricing.refundPolicy}
          </button>
        </div>
      </div>
      {refundModalOpen && (
        <div className="absolute inset-0 z-[260] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRefundModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-black text-slate-900 mb-6">{t.pricing.refundPolicy}</h3>
            <p className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line">
              {t.pricing.refundPolicyText}
            </p>
            <button
              onClick={() => setRefundModalOpen(false)}
              className="mt-8 w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              {t.pricing.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePlanSheet;
