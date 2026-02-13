
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReportView from './components/ReportView';
import MyReports from './components/MyReports';
import Pricing from './components/Pricing';
import AIChat from './components/AIChat';
import Logo from './components/Logo';
import { useAuth } from './context/AuthContext';
import { generateMockReport } from './services/geminiService';
import { fetchCarReportFromOneAuto } from './services/oneAutoApiService';
import { saveReport } from './services/reportsFirestore';
import { CarReport } from './types';
import { translations } from './constants/translations';

const App: React.FC = () => {
  const { user } = useAuth();
  const [lang, setLang] = useState<'lt' | 'en'>('lt');
  const [report, setReport] = useState<CarReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showMyReports, setShowMyReports] = useState(false);

  const t = translations[lang];

  const steps = lang === 'lt' ? [
    "Jungiamasi prie tarptautinių duomenų bazių...",
    "Tikrinami ridos įrašai TA centruose...",
    "Analizuojamas žalų registras...",
    "Tikrinama Interpol vagysčių bazė...",
    "Generuojama išsami ataskaita..."
  ] : [
    "Connecting to international databases...",
    "Checking mileage records...",
    "Analyzing damage registry...",
    "Checking Interpol databases...",
    "Generating report..."
  ];

  const LOAD_DURATION_MS = 20000;
  const TICK_MS = 200;

  useEffect(() => {
    let interval: number;
    let startTime = 0;
    if (loading) {
      setProgress(0);
      startTime = Date.now();
      let stepIdx = 0;
      setLoadingStep(steps[0]);

      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, (elapsed / LOAD_DURATION_MS) * 100);
        setProgress(pct);
        const currentStepIdx = Math.min(steps.length - 1, Math.floor((pct / 100) * steps.length));
        if (steps[currentStepIdx]) {
          setLoadingStep(steps[currentStepIdx]);
        }
      }, TICK_MS);
    }
    return () => clearInterval(interval);
  }, [loading, lang]);

  const handleSearch = async (vin: string) => {
    setLoading(true);
    setReport(null);
    setError(null);
    try {
      let data: CarReport | null = null;
      let apiError: string | null = null;
      try {
        data = await fetchCarReportFromOneAuto(vin);
      } catch (e) {
        data = null;
        apiError = e instanceof Error ? e.message : String(e);
      }
      const hasVinKey = !!(process.env.VIN_API_KEY);
      const mockDisabled = hasVinKey || (process.env.DISABLE_MOCK_REPORT === "true" || process.env.DISABLE_MOCK_REPORT === "1");
      if (!data) {
        if (mockDisabled) {
          setError(apiError || (lang === "lt" ? "Duomenų nepavyko gauti iš API. Patikrinkite raktą ir ryšį." : "Failed to get data from API. Check key and connection."));
          setLoading(false);
          return;
        }
        data = await generateMockReport(vin);
      }
      setProgress(100);
      setLoadingStep(lang === 'lt' ? "Paruošta!" : "Ready!");
      const reportData = { ...data, vin };
      setReport(reportData);
      if (user) {
        saveReport(user.uid, reportData).catch(() => {});
      }
      await new Promise(resolve => setTimeout(resolve, 400));
      const reportElement = document.getElementById('car-report');
      if (reportElement) reportElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(lang === 'lt' ? "Nepavyko gauti duomenų. Patikrinkite ryšį." : "Failed to retrieve data.");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleSaveReport = async (r: CarReport) => {
    if (!user) return;
    await saveReport(user.uid, r);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar lang={lang} setLang={setLang} t={t} onMyReportsClick={() => setShowMyReports(true)} />
      
      <main className="overflow-x-hidden">
        <Hero onSearch={handleSearch} loading={loading} t={t} />

        {loading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white p-10 rounded-[3rem] border border-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500">
              <div className="text-center mb-10">
                <div className="inline-flex mb-8">
                   <Logo size="lg" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  {lang === 'lt' ? 'Skenuojama istorija' : 'Scanning History'}
                </h3>
                <p className="text-indigo-600 font-bold text-[11px] h-4 animate-pulse uppercase tracking-[0.2em]">
                  {loadingStep}
                </p>
              </div>

              <div className="relative mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'lt' ? 'Saugus ryšys' : 'Secure Connection'}</span>
                  <span className="text-3xl font-black text-indigo-600 font-mono tracking-tighter">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-10 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                SSL Encryption Active
              </div>
            </div>
          </div>
        )}

        {error && (
            <div className="max-w-xl mx-auto px-4 mb-12">
                <div className="bg-rose-50 border border-rose-100 text-rose-700 px-7 py-5 rounded-[2rem] flex items-center gap-4 shadow-xl">
                    <span className="text-sm font-bold">{error}</span>
                </div>
            </div>
        )}

        <div id="car-report">
          {report && !loading && (
            <ReportView
              report={report}
              lang={lang}
              canSave={!!user}
              onSaveReport={user ? () => handleSaveReport(report) : undefined}
            />
          )}
        </div>

        {showMyReports && (
          <MyReports
            lang={lang}
            onSelectReport={(r) => { setReport(r); setShowMyReports(false); }}
            onClose={() => setShowMyReports(false)}
          />
        )}

        <Pricing t={t} />

        {!report && !loading && (
          <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { title: lang === 'lt' ? 'Ridos Istorija' : 'Mileage History', desc: lang === 'lt' ? 'Analizuojame duomenis iš visos Europos dilerių ir TA registrų.' : 'Analyzing data from dealers and registries across Europe.' },
                { title: lang === 'lt' ? 'Žalų Registras' : 'Damage Records', desc: lang === 'lt' ? 'Pateikiame detalią informaciją apie eismo įvykius.' : 'Detailed information about traffic accidents.' },
                { title: lang === 'lt' ? 'Vagysčių Patikra' : 'Theft Check', desc: lang === 'lt' ? 'Tikriname Interpol ir vietines policijos bazes.' : 'Checking Interpol and local police databases.' }
              ].map((feat, idx) => (
                <div key={idx} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feat.title}</h3>
                  <p className="text-slate-500 font-medium">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-10">
            <Logo size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          </div>
          <p className="text-slate-500 max-w-lg mx-auto mb-12 text-base font-medium px-4">
            {t.footer.desc}
          </p>
          <div className="text-[11px] text-slate-400 font-black tracking-[0.3em] uppercase border-t border-slate-50 pt-12">
            &copy; {new Date().getFullYear()} vinscanner.eu. All rights reserved.
          </div>
        </div>
      </footer>

      <AIChat />
    </div>
  );
};

export default App;
