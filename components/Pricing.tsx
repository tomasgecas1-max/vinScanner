
import React from 'react';

interface PricingProps {
  t: any;
}

const Pricing: React.FC<PricingProps> = ({ t }) => {
  const isLt = t.nav.services === 'Paslaugos';

  const plans = [
    {
      name: isLt ? "Vienkartinė" : "Single",
      count: isLt ? "1 ataskaita" : "1 Report",
      price: 14,
      oldPrice: 19,
      features: isLt 
        ? ["Pilna ridos istorija", "Žalų registras", "Vagysčių patikra", "Techninė specifikacija"]
        : ["Full mileage history", "Damage records", "Theft check", "Technical specs"],
      highlight: false
    },
    {
      name: isLt ? "Populiariausias" : "Most Popular",
      count: isLt ? "2 ataskaitos" : "2 Reports",
      price: 20,
      oldPrice: 25,
      features: isLt 
        ? ["Viskas kas įeina į 1 patikrą", "Galioja 30 dienų", "Prioritetinis palaikymas", "AI eksperto įžvalgos"]
        : ["Everything in 1 check", "Valid for 30 days", "Priority support", "AI Expert insights"],
      highlight: false
    },
    {
      name: isLt ? "Geriausia vertė" : "Best Value",
      count: isLt ? "3 ataskaitos" : "3 Reports",
      price: 26,
      oldPrice: 31,
      features: isLt 
        ? ["Viskas kas įeina į 2 patikras", "Geriausia kaina už vnt.", "Neribotas galiojimas", "PDF siuntimas"]
        : ["Everything in 2 checks", "Best unit price", "Unlimited validity", "PDF downloads"],
      highlight: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
            {t.pricing.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-300 border ${
                plan.highlight 
                  ? 'bg-slate-900 text-white border-slate-800 shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] scale-105 z-10' 
                  : 'bg-white text-slate-900 border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  {t.pricing.bestValue}
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-3 ${plan.highlight ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {plan.name}
                </h3>
                <div className="text-3xl font-black mb-4 tracking-tight">{plan.count}</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-black tracking-tighter">{plan.price} €</span>
                  <span className="text-lg text-slate-400 line-through decoration-rose-500/50 font-bold">{plan.oldPrice} €</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-10 text-left">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-3">
                    <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className={`text-sm font-medium ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                plan.highlight 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
              }`}>
                {t.pricing.order}
              </button>
            </div>
          ))}
        </div>
        
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
