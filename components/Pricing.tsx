import React, { useState } from 'react';

interface PricingProps {
  t: any;
  pendingVin: string | null;
  onPlanSelect: (vin: string, planIndex: number) => void;
}

const Pricing: React.FC<PricingProps> = ({ t, pendingVin, onPlanSelect }) => {
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(1); // default: 2 ataskaitos (vidurinis planas)

  const plans = [
    { name: t.pricing.planSingle, count: t.pricing.report1, reportCount: 1, price: 12, oldPrice: 24, bestValue: false },
    { name: t.pricing.planPopular, count: t.pricing.reports2, reportCount: 2, price: 20, oldPrice: 40, bestValue: false },
    { name: t.pricing.planBestValue, count: t.pricing.reports3, reportCount: 3, price: 27, oldPrice: 54, bestValue: true },
  ];

  const scrollToVinInput = () => {
    const hero = document.querySelector('form');
    if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="pricing" className={`py-10 sm:py-20 lg:py-24 overflow-hidden transition-all duration-300 ${pendingVin ? 'bg-indigo-50/50' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 text-center">
        {pendingVin && (
          <div className="mb-8 p-5 rounded-2xl bg-indigo-100 border border-indigo-200">
            <p className="text-indigo-900 font-bold text-lg">
              {t.pricing.selectPlanForVin}: <span className="font-mono text-indigo-700">{pendingVin}</span>
            </p>
          </div>
        )}
        <div className="mb-6 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
            {t.pricing.descHighlight ? (
              <>
                {t.pricing.desc.split(t.pricing.descHighlight)[0]}
                <strong className="text-indigo-600 font-bold">{t.pricing.descHighlight}</strong>
                {t.pricing.desc.split(t.pricing.descHighlight)[1]}
              </>
            ) : (
              t.pricing.desc
            )}
          </p>
        </div>

        <div id="pricing-plans" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 items-stretch scroll-mt-20 sm:scroll-mt-24">
          {plans.map((plan, idx) => {
            const isSelected = selectedPlanIdx === idx;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPlanIdx(idx)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedPlanIdx(idx)}
                className={`relative flex flex-col p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-800 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] scale-105 z-10'
                    : 'bg-white text-slate-900 border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2'
                }`}
              >
                <div className="mb-4 sm:mb-10">
                  <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2 sm:mb-3 ${isSelected ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {plan.name}
                  </h3>
                  <div className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-tight">{plan.count}</div>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-4xl sm:text-5xl font-black tracking-tighter">{plan.price} €</span>
                    {plan.oldPrice != null && (
                      <span className="text-xl sm:text-2xl text-slate-400 line-through decoration-2 decoration-rose-500 font-bold">{plan.oldPrice} €</span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold mt-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                    ({t.pricing.perReport} {(plan.price / plan.reportCount).toFixed(0)} €)
                  </p>
                </div>

                <div 
                  className="flex flex-col items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => { 
                      if (isSelected) {
                        pendingVin ? onPlanSelect(pendingVin, idx) : scrollToVinInput(); 
                      } else {
                        setSelectedPlanIdx(idx);
                      }
                    }}
                    className={`w-full max-w-[260px] py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40'
                        : 'bg-slate-300 text-slate-500 shadow-slate-100 hover:bg-slate-400'
                    }`}
                  >
                    {t.pricing.order}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setRefundModalOpen(true); }}
                    className={`text-[10px] font-bold underline underline-offset-2 transition-colors ${isSelected ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-600'}`}
                  >
                    {t.pricing.refundPolicy}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {refundModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setRefundModalOpen(false)}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

        <div className="mt-6 sm:mt-12 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholder for payment methods */}
           <div className="text-[10px] font-black tracking-widest uppercase">Visa</div>
           <div className="text-[10px] font-black tracking-widest uppercase">Mastercard</div>
           <div className="text-[10px] font-black tracking-widest uppercase">Apple Pay</div>
           <div className="text-[10px] font-black tracking-widest uppercase">Google Pay</div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
