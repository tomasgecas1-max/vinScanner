
import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

interface HeroProps {
  onVinSubmit: (vin: string) => void;
  loading: boolean;
  t: any;
  useServiceHistory: boolean;
  useVinLookup: boolean;
  useVehicleSpecs: boolean;
  useCarsXeHistory: boolean;
  onUseServiceHistoryChange: (v: boolean) => void;
  onUseVinLookupChange: (v: boolean) => void;
  onUseVehicleSpecsChange: (v: boolean) => void;
  onUseCarsXeHistoryChange: (v: boolean) => void;
}

const mileageData = [
  { year: '2020', km: 124000 },
  { year: '2021', km: 158500 },
  { year: '2022', km: 192200 },
  { year: '2023', km: 95000, suspicious: true },
  { year: '2024', km: 112402 }
];

// Vertės duomenys: 2023 m. (25k), 2024 m. (avarija - 11k), 2026 m. (atsigavimas - 16k)
const valueData = [
  { year: '2023', val: 25000, status: 'normal' },
  { year: '2024', val: 11000, status: 'crash' }, // Ryškus kritimas po avarijos
  { year: '2026', val: 16000, status: 'high' },    // Atsigavusi kaina po remonto
];

const Hero: React.FC<HeroProps> = ({ onVinSubmit, loading, t, useServiceHistory, useVinLookup, useVehicleSpecs, useCarsXeHistory, onUseServiceHistoryChange, onUseVinLookupChange, onUseVehicleSpecsChange, onUseCarsXeHistoryChange }) => {
  const [vin, setVin] = useState('');
  const SAMPLE_VIN = "WBAUR51010CZ12345";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim().length > 5) onVinSubmit(vin.trim());
  };

  const handleSampleClick = () => {
    setVin(SAMPLE_VIN);
    onVinSubmit(SAMPLE_VIN);
  };

  return (
    <div className="relative pt-24 pb-12 lg:pt-36 lg:pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[140px] opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[140px] opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 text-center lg:text-left z-30 w-full max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.05]">
              {t.hero.title} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {t.hero.desc}
            </p>

            <div className="max-w-xl mx-auto lg:mx-0 relative z-40">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col gap-3 sm:block">
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder={t.hero.placeholder}
                    className="w-full h-14 sm:h-20 pl-6 sm:pl-8 pr-6 sm:pr-44 rounded-[1.5rem] border-2 border-slate-200/60 bg-white/80 backdrop-blur-xl text-base sm:text-lg font-semibold focus:outline-none focus:border-indigo-500 transition-all shadow-2xl shadow-slate-200/50"
                    maxLength={17}
                  />
                  <button
                    disabled={loading}
                    type="submit"
                    className="sm:absolute sm:right-2.5 sm:top-2.5 sm:bottom-2.5 w-full sm:w-auto h-14 sm:h-auto px-10 py-3 sm:py-0 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all min-w-0 sm:min-w-[140px] shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95 disabled:bg-slate-400"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto sm:mx-0"></div>
                    ) : (
                      t.hero.button
                    )}
                  </button>
                </div>
              </form>
              <div className="mt-6 text-left pl-2 space-y-3">
                <button onClick={handleSampleClick} className="text-xs text-indigo-600/80 hover:text-indigo-800 font-bold transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                  {t.hero.sample}: <span className="underline decoration-indigo-200 underline-offset-4 font-mono">{SAMPLE_VIN}</span>
                </button>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
                  <span className="text-slate-400 font-bold uppercase tracking-wide">API šaltiniai (laikinai):</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useServiceHistory} onChange={(e) => onUseServiceHistoryChange(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    EzyVIN Service History
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useVinLookup} onChange={(e) => onUseVinLookupChange(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    OE VIN Lookup (Europe)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useVehicleSpecs} onChange={(e) => onUseVehicleSpecsChange(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    CarsXE Specs
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={useCarsXeHistory} onChange={(e) => onUseCarsXeHistoryChange(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    CarsXE History
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block flex-1 relative w-full h-[650px] select-none">
            {/* 1. Ridos istorija */}
            <div className="absolute top-[20px] right-[0px] w-[380px] bg-white/95 backdrop-blur-xl p-6 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white z-20 overflow-hidden rotate-[-1deg]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                  </div>
                  <div className="w-20 h-3 bg-slate-100 rounded-full overflow-hidden relative">
                     <div className="absolute inset-0 bg-rose-500 w-1/3 animate-pulse"></div>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center text-rose-500 font-black text-[10px]">!</div>
              </div>
              <div className="h-40 w-full opacity-90 pr-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mileageData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      hide={false} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 8, fontWeight: 800, fill: '#cbd5e1'}} 
                      dy={8}
                    />
                    <YAxis 
                      hide={true} 
                      domain={['dataMin - 30000', 'dataMax + 30000']} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="km" 
                      stroke="#ef4444" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorKm)" 
                      connectNulls={true}
                    >
                      <LabelList 
                        dataKey="km" 
                        position="top" 
                        offset={10}
                        content={({ x, y, value, index }) => {
                          const isSuspicious = mileageData[index].suspicious;
                          return (
                            <text 
                              x={x} 
                              y={y} 
                              dy={-6} 
                              fill={isSuspicious ? "#ef4444" : "#94a3b8"} 
                              fontSize={8} 
                              fontWeight={900} 
                              textAnchor="middle"
                            >
                              {(Number(value) / 1000).toFixed(0)}k
                            </text>
                          );
                        }}
                      />
                    </Area>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Žalų Skydelis */}
            <div className="absolute top-[280px] right-[240px] w-[220px] bg-white/95 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] border border-white/50 z-30 rotate-[2deg]">
              <div className="flex justify-between items-center mb-5">
                 <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 border border-rose-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                 </div>
                 <div className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-md shadow-sm">1</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative overflow-hidden">
                   <div className="flex justify-center items-center py-2">
                      <div className="relative w-28 h-12 flex items-center justify-center">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 text-rose-500 animate-pulse">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2L14.5 9H22L16 13L18 21L12 17L6 21L8 13L2 9H9.5L12 2Z" />
                           </svg>
                        </div>
                        <div className="relative w-20 h-8">
                           <div className="absolute bottom-1 left-0 right-0 h-4 bg-slate-300 rounded-lg"></div>
                           <div className="absolute top-0 left-4 right-6 h-4 bg-slate-200 rounded-t-xl border-t border-slate-400"></div>
                           <div className="absolute bottom-1 left-0 w-4 h-4 bg-rose-100/80 rounded-l-md border-l border-rose-400 border-dashed"></div>
                           <div className="absolute -bottom-1 left-2 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-100"></div>
                           <div className="absolute -bottom-1 right-2 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-100"></div>
                        </div>
                      </div>
                   </div>
                   <div className="flex justify-center items-center border-t border-slate-200/50 pt-3">
                      <div className="text-[16px] font-black text-rose-600 tracking-tighter drop-shadow-sm">3,000 €</div>
                   </div>
                </div>
              </div>
            </div>

            {/* 3. Rinkos vertės grafikas (2023: 25k, 2026: 16k) */}
            <div className="absolute top-[400px] right-[20px] w-[340px] bg-white/95 backdrop-blur-xl p-8 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white z-20 overflow-hidden rotate-[-1.5deg]">
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xl font-black text-slate-900 tracking-tighter">16,000 €</div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+45% RECOVERY</div>
                </div>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={valueData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}} 
                    />
                    <Bar dataKey="val" radius={[6, 6, 6, 6]} barSize={54}>
                      {valueData.map((entry, index) => {
                        let barColor = '#f1f5f9';
                        if (entry.status === 'crash') barColor = '#fb7185';
                        if (entry.status === 'high') barColor = '#6366f1';
                        if (entry.year === '2023') barColor = '#94a3b8'; // Pilka pradinei aukštai vertei
                        
                        return <Cell key={`cell-${index}`} fill={barColor} className="transition-all duration-500" />;
                      })}
                      <LabelList 
                        dataKey="val" 
                        position="top" 
                        content={({ x, y, width, value, index }) => (
                          <text 
                            x={(x as number) + (width as number) / 2} 
                            y={(y as number) - 8} 
                            fill={valueData[index].status === 'crash' ? '#e11d48' : '#64748b'} 
                            fontSize={9} 
                            fontWeight={900} 
                            textAnchor="middle"
                          >
                            {(value as number / 1000).toFixed(0)}k
                          </text>
                        )}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Progresinė juosta buvo čia - pašalinta vartotojo prašymu */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
