import React, { useState } from 'react';

interface PricingProps {
  t: any;
  pendingVin: string | null;
  onPlanSelect: (vin: string, planIndex: number) => void;
}

const Pricing: React.FC<PricingProps> = ({ t, pendingVin, onPlanSelect }) => {
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(1); // default: 2 ataskaitos (vidurinis planas)
  const isLt = t.nav.services === 'Paslaugos';

  const plans = [
    { name: isLt ? "Vienkartinė" : "Single", count: isLt ? "1 ataskaita" : "1 Report", price: 14, oldPrice: 19, bestValue: false },
    { name: isLt ? "Populiariausias" : "Most Popular", count: isLt ? "2 ataskaitos" : "2 Reports", price: 20, oldPrice: 25, bestValue: false },
    { name: isLt ? "Geriausia vertė" : "Best Value", count: isLt ? "3 ataskaitos" : "3 Reports", price: 26, oldPrice: 31, bestValue: true },
  ];

  const scrollToVinInput = () => {
    const hero = document.querySelector('form');
    if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="pricing" className={`py-24 overflow-hidden transition-all duration-300 ${pendingVin ? 'bg-indigo-50/50' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {pendingVin && (
          <div className="mb-8 p-5 rounded-2xl bg-indigo-100 border border-indigo-200">
            <p className="text-indigo-900 font-bold text-lg">
              {t.pricing.selectPlanForVin}: <span className="font-mono text-indigo-700">{pendingVin}</span>
            </p>
          </div>
        )}
        <div className="mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isSelected = selectedPlanIdx === idx;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedPlanIdx(idx)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedPlanIdx(idx)}
                className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-800 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] scale-105 z-10'
                    : 'bg-white text-slate-900 border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2'
                }`}
              >
                {plan.bestValue && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {t.pricing.bestValue}
                  </div>
                )}

                <div className="mb-10">
                  <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-3 ${isSelected ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-black mb-4 tracking-tight">{plan.count}</div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-black tracking-tighter">{plan.price} €</span>
                    <span className="text-lg text-slate-400 line-through decoration-rose-500/50 font-bold">{plan.oldPrice} €</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={!isSelected}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (isSelected) {
                        pendingVin ? onPlanSelect(pendingVin, idx) : scrollToVinInput(); 
                      }
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                      isSelected
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40 active:scale-95 cursor-pointer'
                        : 'bg-slate-300 text-slate-500 shadow-slate-100 cursor-not-allowed'
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

        <div className="mt-12 flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
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
