import React from 'react';
import type { Translations } from '../constants/translations';

interface SampleReportModalProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
}

const SampleReportModal: React.FC<SampleReportModalProps> = ({ open, onClose, t }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 shrink-0 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900">{t.nav.sampleReport}</h2>
            <p className="text-xs text-slate-500 mt-1">VIN: WBAUR51010CZ12345 · BMW 320i</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Vehicle Info */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">{t.report.vehicleInfo}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t.report.make}</p>
                <p className="text-lg font-black text-slate-900">BMW</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t.report.model}</p>
                <p className="text-lg font-black text-slate-900">320i</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{t.report.year}</p>
                <p className="text-lg font-black text-slate-900">2019</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">VIN</p>
                <p className="text-sm font-mono font-bold text-slate-700">WBAUR51010CZ12345</p>
              </div>
            </div>
          </div>

          {/* Mileage History */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">{t.report.mileageHistory}</h3>
            <div className="space-y-3">
              {[
                { date: '2024-01-15', value: 78500 },
                { date: '2023-06-20', value: 65200 },
                { date: '2022-12-05', value: 52100 },
                { date: '2022-03-18', value: 38400 },
                { date: '2021-07-22', value: 25600 },
                { date: '2020-11-10', value: 12300 },
                { date: '2019-08-01', value: 0 },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm font-medium text-slate-600">{item.date}</span>
                  <span className="text-sm font-black text-slate-900">{item.value.toLocaleString()} km</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
              <p className="text-xs font-bold text-emerald-700">✓ {t.report.mileageConsistent || 'Mileage history is consistent'}</p>
            </div>
          </div>

          {/* Service History */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">{t.report.serviceHistory}</h3>
            <div className="space-y-4">
              {[
                { date: '2024-01-15', provider: 'BMW Service Center Munich', type: 'Regular Service', mileage: 78500, actions: ['Oil change', 'Brake inspection', 'Filter replacement'] },
                { date: '2023-06-20', provider: 'AutoService Plus', type: 'Maintenance', mileage: 65200, actions: ['Tire rotation', 'Brake fluid change'] },
                { date: '2022-12-05', provider: 'BMW Authorized Dealer', type: 'Major Service', mileage: 52100, actions: ['Timing belt replacement', 'Spark plugs', 'Full inspection'] },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.type}</p>
                      <p className="text-xs text-slate-500">{item.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-600">{item.date}</p>
                      <p className="text-xs font-bold text-slate-900">{item.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.actions.map((action, j) => (
                      <span key={j} className="px-2 py-1 bg-white text-[10px] font-medium text-slate-600 rounded-lg">{action}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theft Status */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-black text-emerald-800">{t.report.theftClear || 'Not reported stolen'}</p>
                <p className="text-xs text-emerald-600">{t.report.theftDesc || 'Vehicle has no theft records'}</p>
              </div>
            </div>
          </div>

          {/* Market Value */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">{t.report.marketValue}</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Min</p>
                <p className="text-xl font-black text-slate-900">€18,500</p>
              </div>
              <div className="border-x border-amber-200">
                <p className="text-[10px] font-bold text-amber-600 uppercase">{t.report.average || 'Average'}</p>
                <p className="text-2xl font-black text-amber-600">€22,800</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Max</p>
                <p className="text-xl font-black text-slate-900">€26,500</p>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">{t.report.technicalSpecs}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Engine', '2.0L Turbo I4'],
                ['Power', '184 HP'],
                ['Transmission', '8-Speed Automatic'],
                ['Fuel Type', 'Petrol'],
                ['Drive', 'RWD'],
                ['Body', 'Sedan'],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-xs font-medium text-slate-500">{label}</span>
                  <span className="text-xs font-bold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 transition-colors"
          >
            {t.pricing.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;
