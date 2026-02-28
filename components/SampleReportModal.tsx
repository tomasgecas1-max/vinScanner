import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Translations } from '../constants/translations';

interface SampleReportModalProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
}

const SAMPLE_VIN = 'WBA8E1100XK477XXX';

const MILEAGE_HISTORY = [
  { date: '2016-08-15', value: 3563 },
  { date: '2016-12-08', value: 15921 },
  { date: '2017-03-30', value: 29828 },
  { date: '2017-05-09', value: 33204 },
  { date: '2017-12-23', value: 53081 },
  { date: '2018-03-19', value: 57952 },
  { date: '2018-07-10', value: 64229 },
  { date: '2018-08-23', value: 65781 },
  { date: '2018-08-29', value: 66092 },
  { date: '2018-12-22', value: 74019 },
  { date: '2019-01-03', value: 74205 },
  { date: '2019-04-02', value: 79498 },
  { date: '2019-04-19', value: 80772 },
  { date: '2020-01-09', value: 96802 },
  { date: '2020-02-10', value: 99074 },
  { date: '2020-04-20', value: 100837 },
  { date: '2020-06-02', value: 101379 },
  { date: '2020-09-03', value: 101944 },
  { date: '2021-04-01', value: 115172 },
  { date: '2021-05-04', value: 118007 },
  { date: '2021-10-10', value: 130176 },
  { date: '2021-10-22', value: 131468 },
  { date: '2022-09-01', value: 155889 },
  { date: '2023-04-17', value: 169389 },
  { date: '2023-04-27', value: 170843 },
  { date: '2023-04-28', value: 170975 },
  { date: '2023-10-13', value: 181495 },
  { date: '2023-10-20', value: 182752 },
  { date: '2023-10-23', value: 183045 },
  { date: '2024-09-23', value: 200179 },
  { date: '2024-10-24', value: 200220 },
  { date: '2024-12-06', value: 201986 },
];

const SERVICE_EVENTS = [
  {
    date: '2024-12-06',
    mileage: 201986,
    provider: null,
    actions: [],
  },
  {
    date: '2024-10-24',
    mileage: 200220,
    provider: null,
    actions: [],
  },
  {
    date: '2024-09-23',
    mileage: 200179,
    provider: null,
    actions: [],
  },
  {
    date: '2023-10-23',
    mileage: 183045,
    provider: null,
    actions: [],
  },
  {
    date: '2023-04-28',
    mileage: 170975,
    provider: 'Oficialus BMW Servisas, Lenkija',
    actions: ['Engine oil.', 'Brake fluid service.', 'Microfilter.'],
  },
  {
    date: '2022-09-01',
    mileage: 155889,
    provider: null,
    actions: [],
  },
  {
    date: '2021-10-22',
    mileage: 131468,
    provider: 'Oficialus BMW Servisas, Lenkija',
    actions: ['Engine oil.', 'Air filter element.', 'Vehicle check.', 'Microfilter.'],
  },
  {
    date: '2021-05-04',
    mileage: 118007,
    provider: 'Oficialus BMW Servisas, Lenkija',
    actions: ['Brake fluid service.'],
  },
  {
    date: '2020-09-03',
    mileage: 101944,
    provider: 'BMW Dileris, Olandija',
    actions: ['Statutory vehicle inspection.'],
  },
  {
    date: '2020-02-10',
    mileage: 99074,
    provider: 'Oficialus BMW Dileris, Olandija',
    actions: ['Engine oil.', 'Microfilter.'],
  },
  {
    date: '2019-04-19',
    mileage: 80772,
    provider: 'Oficialus BMW Dileris, Olandija',
    actions: ['Brake fluid service.'],
  },
  {
    date: '2018-08-23',
    mileage: 65781,
    provider: 'Oficialus BMW Dileris, Olandija',
    actions: ['Engine oil.', 'Air filter element.', 'Vehicle check.', 'Microfilter.'],
  },
  {
    date: '2017-05-09',
    mileage: 33204,
    provider: 'Oficialus BMW Dileris, Olandija',
    actions: ['Engine oil.', 'Microfilter.'],
  },
];

const TECHNICAL_SPECS = {
  manufacturer: 'BMW',
  model: '3 (F30, F80) 330 e',
  year: 2016,
  power_kw: '185 kW',
  power_bhp: '252 AG',
  engine: 'B48 B20 A',
  fuel: 'Benzinas',
  transmission: 'Automatinė',
  drivetrain: 'Galinė pavara',
  body: 'Sedanas',
  color: 'Juoda safyro metalik',
  interior: 'Oda Dakota',
};

const SampleReportModal: React.FC<SampleReportModalProps> = ({ open, onClose, t }) => {
  if (!open) return null;

  const chartData = MILEAGE_HISTORY.filter((_, i) => i % 4 === 0 || i === MILEAGE_HISTORY.length - 1);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
            <div className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.nav.sampleReport}</div>
            <h2 className="text-xl md:text-2xl font-bold">{TECHNICAL_SPECS.year} {TECHNICAL_SPECS.manufacturer} {TECHNICAL_SPECS.model}</h2>
            <div className="flex items-center gap-2 mt-2 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span className="font-mono text-sm">{SAMPLE_VIN}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {t.report.theftClear}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Technical Specs */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4">{t.report.technicalSpecs}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.make}</p>
                <p className="text-sm font-bold text-slate-900">{TECHNICAL_SPECS.manufacturer}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.model}</p>
                <p className="text-sm font-bold text-slate-900">330 e</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.year}</p>
                <p className="text-sm font-bold text-slate-900">{TECHNICAL_SPECS.year}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.power || 'Galia'}</p>
                <p className="text-sm font-bold text-slate-900">{TECHNICAL_SPECS.power_bhp}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.engine || 'Variklis'}</p>
                <p className="text-sm font-bold text-slate-900">{TECHNICAL_SPECS.engine}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.fuelType || 'Kuras'}</p>
                <p className="text-sm font-bold text-slate-900">{TECHNICAL_SPECS.fuel}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.transmission || 'Pavarų dėžė'}</p>
                <p className="text-sm font-bold text-slate-900">{TECHNICAL_SPECS.transmission}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.report.colour || 'Spalva'}</p>
                <p className="text-sm font-bold text-slate-900">{TECHNICAL_SPECS.color}</p>
              </div>
            </div>
          </div>

          {/* Mileage Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-2-2"/></svg>
                {t.report.mileageHistory}
              </h3>
              <span className="text-xs text-slate-500 font-medium">{t.report.lastMileage} 201,986 km</span>
            </div>
            <div className="h-48 w-full bg-slate-50 rounded-xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                    formatter={(value: number) => [`${value.toLocaleString()} km`, 'Rida']}
                  />
                  <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 bg-emerald-50 rounded-xl">
              <p className="text-xs font-bold text-emerald-700">✓ {t.report.mileageConsistent || 'Ridos istorija nuosekli – manipuliacijų požymių nerasta'}</p>
            </div>
          </div>

          {/* Service History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              {t.report.serviceHistory} ({SERVICE_EVENTS.length} {t.report.records || 'įrašai'})
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {SERVICE_EVENTS.map((event, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold text-slate-800">{event.date}</span>
                    <span className="text-sm font-semibold text-indigo-600">{event.mileage.toLocaleString()} km</span>
                  </div>
                  {event.provider && (
                    <p className="text-xs text-slate-500 mb-2">{event.provider}</p>
                  )}
                  {event.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.actions.map((action, i) => (
                        <span key={i} className="px-2 py-1 bg-white text-[10px] font-medium text-slate-600 rounded-lg border border-slate-100">
                          {action}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Market Value */}
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 mb-4">{t.report.marketValue}</h3>
            <div className="text-3xl font-extrabold text-indigo-600 mb-1">~12,500 €</div>
            <p className="text-xs text-indigo-700/70 mb-4">{t.report.marketValueBased || 'Remiantis rinkos duomenimis'}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider">
                <span className="text-indigo-900/40">{t.report.min || 'Min'}</span>
                <span className="text-indigo-900/40">{t.report.max || 'Max'}</span>
              </div>
              <div className="w-full bg-indigo-200/50 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-1/2 ml-[25%]"></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-indigo-900">
                <span>9,500 €</span>
                <span>15,500 €</span>
              </div>
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
                <p className="text-sm font-bold text-emerald-800">{t.report.theftClear}</p>
                <p className="text-xs text-emerald-600">{t.report.theftDesc || 'Automobilis nėra ieškomas, nėra vagystės įrašų'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 transition-colors"
          >
            {t.pricing.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;
