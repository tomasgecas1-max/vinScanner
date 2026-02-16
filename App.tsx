
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobilePlanSheet from './components/MobilePlanSheet';
import OrderEmailStepModal from './components/OrderEmailStepModal';
import PaymentModal from './components/PaymentModal';
import Hero from './components/Hero';
import ReportView from './components/ReportView';
import MyReports from './components/MyReports';
import Pricing from './components/Pricing';
import AIChat from './components/AIChat';
import Logo from './components/Logo';
import { useAuth } from './context/AuthContext';
import { generateMockReport } from './services/geminiService';
import { fetchCarReportFromOneAuto, HISTORY_NOT_FOUND_ERROR } from './services/oneAutoApiService';
import { fetchVehicleSpecs, mapVehicleSpecsToReportFields } from './services/carsxeApiService';
import { saveReport } from './services/reportsFirestore';
import { CarReport } from './types';
import { translations } from './constants/translations';
import type { SupportedLang } from './constants/translations';

const App: React.FC = () => {
  const { user } = useAuth();
  const [lang, setLang] = useState<SupportedLang>('lt');
  const [report, setReport] = useState<CarReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showMyReports, setShowMyReports] = useState(false);
  const [myReportsRefreshKey, setMyReportsRefreshKey] = useState(0);
  const [useServiceHistory, setUseServiceHistory] = useState(true);
  const [useVinLookup, setUseVinLookup] = useState(true);
  const [useVehicleSpecs, setUseVehicleSpecs] = useState(true);
  const [pendingVin, setPendingVin] = useState<string | null>(null);
  const [showMobilePlanSheet, setShowMobilePlanSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOrderEmailModal, setShowOrderEmailModal] = useState(false);
  const [vinForOrder, setVinForOrder] = useState<string | null>(null);
  const [planIndexForOrder, setPlanIndexForOrder] = useState<number>(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderEmail, setOrderEmail] = useState<string | null>(null);
  const [redirectOrder, setRedirectOrder] = useState<{ vin: string; email?: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('redirect_status') === 'succeeded' && params.get('payment_intent_client_secret')) {
      try {
        const raw = sessionStorage.getItem('vinscanner_pending_order');
        const data = raw ? JSON.parse(raw) : null;
        sessionStorage.removeItem('vinscanner_pending_order');
        if (data?.vin && typeof data.vin === 'string' && data.vin.trim().length > 5) {
          setRedirectOrder({ vin: data.vin.trim(), email: data.email || undefined });
        }
      } catch (_) {}
      window.history.replaceState({}, '', window.location.pathname || '/');
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const t = translations[lang];
  const steps = t.loading.steps;

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

  const handleVinSubmit = (vin: string) => {
    if (vin.trim().length > 5) {
      setPendingVin(vin.trim());
      setError(null);
      if (isMobile) {
        setShowMobilePlanSheet(true);
      } else {
        setTimeout(() => {
          const el = document.getElementById('pricing');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  const handlePlanSelect = (vin: string, planIndex: number = 1) => {
    setShowMobilePlanSheet(false);
    setVinForOrder(vin);
    setPlanIndexForOrder(planIndex);
    setShowOrderEmailModal(true);
  };

  const handleOrderEmailConfirm = (vin: string, email: string) => {
    setOrderEmail(email);
    setShowOrderEmailModal(false);
    setShowPaymentModal(true);
  };

  useEffect(() => {
    if (!redirectOrder) return;
    handleSearch(redirectOrder.vin, redirectOrder.email);
    setRedirectOrder(null);
  }, [redirectOrder]);

  const handlePaymentPay = (vin: string, customerEmail?: string) => {
    setShowPaymentModal(false);
    setVinForOrder(null);
    setOrderEmail(null);
    setPendingVin(null);
    handleSearch(vin, customerEmail);
  };

  const handleSearch = async (vin: string, customerEmail?: string) => {
    const previousReport = report;
    setLoading(true);
    setReport(null);
    setError(null);
    try {
      let data: CarReport | null = null;
      let apiError: string | null = null;
      const needsOneAuto = useServiceHistory || useVinLookup;
      const allSourcesChecked = useServiceHistory && useVinLookup && useVehicleSpecs;

      if (needsOneAuto) {
        try {
          data = await fetchCarReportFromOneAuto(vin, {
            useServiceHistory,
            useVinLookup,
            sequential: allSourcesChecked,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          if (msg === HISTORY_NOT_FOUND_ERROR) {
            setError(t.errors.historyNotFound);
            setLoading(false);
            return;
          }
          data = null;
          apiError = msg;
        }
      }

      const hasVinKey = !!(process.env.VIN_API_KEY);
      const mockDisabled = hasVinKey || (process.env.DISABLE_MOCK_REPORT === "true" || process.env.DISABLE_MOCK_REPORT === "1");

      const vinLookupSuccess = data?.rawApiResponses && typeof data.rawApiResponses === "object" && (data.rawApiResponses as Record<string, { success?: boolean }>).vinLookup?.success === true;

      if (!data && useVehicleSpecs) {
        const specsRes = await fetchVehicleSpecs(vin);
        if (specsRes.success && specsRes.result?.attributes) {
          const fromSpecs = mapVehicleSpecsToReportFields(specsRes.result.attributes);
          data = {
            vin,
            make: fromSpecs.make ?? "–",
            model: fromSpecs.model ?? "–",
            year: fromSpecs.year ?? 0,
            mileageHistory: [{ date: new Date().toISOString().slice(0, 7), value: 0 }],
            serviceEvents: [],
            damages: [],
            theftStatus: "unknown",
            technicalSpecs: fromSpecs.technicalSpecs ?? { engine: "–", power: "–", fuelType: "–" },
            marketValue: { min: 0, max: 0, average: 0 },
            rawApiResponses: { vehicleSpecs: specsRes },
          };
        }
      }

      if (!data) {
        if (mockDisabled) {
          setError(apiError || t.errors.apiFailed);
          setLoading(false);
          return;
        }
        data = await generateMockReport(vin);
      }
      setProgress(100);
      setLoadingStep(t.loading.ready);
      let reportData: CarReport = { ...data, vin };

      const alreadyHasVehicleSpecs = data?.rawApiResponses && typeof data.rawApiResponses === "object" && (data.rawApiResponses as Record<string, { success?: boolean }>).vehicleSpecs?.success === true;
      const needVehicleSpecs = useVehicleSpecs && !alreadyHasVehicleSpecs && (allSourcesChecked ? !vinLookupSuccess : true);
      if (needVehicleSpecs) {
        const specsRes = await fetchVehicleSpecs(vin);
        if (specsRes.success && specsRes.result?.attributes) {
          const fromSpecs = mapVehicleSpecsToReportFields(specsRes.result.attributes);
          reportData = {
            ...reportData,
            ...fromSpecs,
            rawApiResponses: { ...(reportData.rawApiResponses as object || {}), vehicleSpecs: specsRes },
          };
        }
      }

      const rawData = reportData.rawApiResponses as { serviceHistory?: { success?: boolean }; vinLookup?: { success?: boolean }; vehicleSpecs?: { success?: boolean } } | undefined;

      let finalReport: CarReport = reportData;
      if (previousReport && previousReport.vin === vin) {
        const raw = data.rawApiResponses as { serviceHistory?: { success?: boolean }; vinLookup?: { success?: boolean } } | undefined;
        finalReport = { ...previousReport };
        if (raw?.serviceHistory?.success) {
          finalReport.mileageHistory = data.mileageHistory;
          finalReport.serviceEvents = data.serviceEvents;
          finalReport.rawApiResponses = { ...(finalReport.rawApiResponses as object || {}), serviceHistory: (data.rawApiResponses as any)?.serviceHistory };
        }
        if (raw?.vinLookup?.success) {
          finalReport.make = data.make;
          finalReport.model = data.model;
          finalReport.year = data.year;
          finalReport.technicalSpecs = data.technicalSpecs;
          finalReport.rawApiResponses = { ...(finalReport.rawApiResponses as object || {}), vinLookup: (data.rawApiResponses as any)?.vinLookup };
        }
        if (rawData?.vehicleSpecs?.success) {
          finalReport.make = reportData.make;
          finalReport.model = reportData.model;
          finalReport.year = reportData.year;
          finalReport.technicalSpecs = reportData.technicalSpecs;
          finalReport.rawApiResponses = { ...(finalReport.rawApiResponses as object || {}), vehicleSpecs: reportData.rawApiResponses && typeof reportData.rawApiResponses === 'object' ? (reportData.rawApiResponses as any).vehicleSpecs : undefined };
        }
      }

      setReport(finalReport);
      if (user) {
        saveReport(user.uid, finalReport).then(() => setMyReportsRefreshKey((k) => k + 1)).catch(() => {});
      }
      if (customerEmail) {
        fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: customerEmail, vin }),
        }).catch(() => {});
      }
      await new Promise(resolve => setTimeout(resolve, 400));
      const reportElement = document.getElementById('car-report');
      if (reportElement) reportElement.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(t.errors.networkFailed);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleSaveReport = async (r: CarReport) => {
    if (!user) return;
    await saveReport(user.uid, r);
  };

  const [supplementLoading, setSupplementLoading] = useState(false);
  const handleSupplementReport = async (vin: string, opts: { useServiceHistory: boolean; useVinLookup: boolean; useVehicleSpecs?: boolean }) => {
    if (!report || (!opts.useServiceHistory && !opts.useVinLookup && !opts.useVehicleSpecs)) return;
    setSupplementLoading(true);
    try {
      const merged: CarReport = { ...report };
      const needsOneAuto = opts.useServiceHistory || opts.useVinLookup;

      if (needsOneAuto) {
        const partial = await fetchCarReportFromOneAuto(vin, {
          useServiceHistory: opts.useServiceHistory,
          useVinLookup: opts.useVinLookup,
        });
        if (partial) {
          const raw = partial.rawApiResponses as { serviceHistory?: { success?: boolean }; vinLookup?: { success?: boolean } } | undefined;
          if (raw?.serviceHistory?.success) {
            merged.mileageHistory = partial.mileageHistory;
            merged.serviceEvents = partial.serviceEvents;
            merged.rawApiResponses = { ...(merged.rawApiResponses as object || {}), serviceHistory: (partial.rawApiResponses as any)?.serviceHistory };
          }
          if (raw?.vinLookup?.success) {
            merged.make = partial.make;
            merged.model = partial.model;
            merged.year = partial.year;
            merged.technicalSpecs = partial.technicalSpecs;
            merged.rawApiResponses = { ...(merged.rawApiResponses as object || {}), vinLookup: (partial.rawApiResponses as any)?.vinLookup };
          }
        }
      }

      if (opts.useVehicleSpecs) {
        const specsRes = await fetchVehicleSpecs(vin);
        if (specsRes.success && specsRes.result?.attributes) {
          const fromSpecs = mapVehicleSpecsToReportFields(specsRes.result.attributes);
          Object.assign(merged, fromSpecs);
          merged.rawApiResponses = { ...(merged.rawApiResponses as object || {}), vehicleSpecs: specsRes };
        }
      }

      setReport(merged);
      if (user) saveReport(user.uid, merged).then(() => setMyReportsRefreshKey((k) => k + 1)).catch(() => {});
    } catch (e) {
      if (typeof console !== 'undefined' && console.error) console.error('Papildymas:', e);
    } finally {
      setSupplementLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar lang={lang} setLang={setLang} t={t} onMyReportsClick={() => setShowMyReports(true)} />
      
      <main className="overflow-x-hidden">
        <Hero
          onVinSubmit={handleVinSubmit}
          loading={loading}
          t={t}
          useServiceHistory={useServiceHistory}
          useVinLookup={useVinLookup}
          useVehicleSpecs={useVehicleSpecs}
          onUseServiceHistoryChange={setUseServiceHistory}
          onUseVinLookupChange={setUseVinLookup}
          onUseVehicleSpecsChange={setUseVehicleSpecs}
        />

        {loading && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white p-10 rounded-[3rem] border border-white shadow-[0_30px_70px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500">
              <div className="text-center mb-10">
                <div className="inline-flex mb-8">
                   <Logo size="lg" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                  {t.loading.scanningHistory}
                </h3>
                <p className="text-indigo-600 font-bold text-[11px] h-4 animate-pulse uppercase tracking-[0.2em]">
                  {loadingStep}
                </p>
              </div>

              <div className="relative mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.loading.secureConnection}</span>
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
                {t.loading.sslEncryption}
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
              t={t}
              lang={lang}
              canSave={!!user}
              onSaveReport={user ? () => handleSaveReport(report) : undefined}
              onSupplementReport={handleSupplementReport}
              supplementLoading={supplementLoading}
            />
          )}
        </div>

        {showMyReports && (
          <MyReports
            t={t}
            lang={lang}
            isOpen={showMyReports}
            refreshKey={myReportsRefreshKey}
            onSelectReport={(r) => { setReport(r); setShowMyReports(false); }}
            onClose={() => setShowMyReports(false)}
          />
        )}

        {pendingVin && isMobile && showMobilePlanSheet && (
          <MobilePlanSheet
            pendingVin={pendingVin}
            t={t}
            onPlanSelect={handlePlanSelect}
            onClose={() => setShowMobilePlanSheet(false)}
          />
        )}
        {showOrderEmailModal && vinForOrder && (
          <OrderEmailStepModal
            open={showOrderEmailModal}
            onClose={() => { setShowOrderEmailModal(false); setVinForOrder(null); }}
            onConfirm={handleOrderEmailConfirm}
            pendingVin={vinForOrder}
            t={t}
          />
        )}
        {showPaymentModal && vinForOrder && (
          <PaymentModal
            open={showPaymentModal}
            onClose={() => { setShowPaymentModal(false); setVinForOrder(null); setOrderEmail(null); }}
            onPay={handlePaymentPay}
            vin={vinForOrder}
            planIndex={planIndexForOrder}
            email={orderEmail ?? undefined}
            t={t}
          />
        )}
        <Pricing t={t} pendingVin={pendingVin} onPlanSelect={handlePlanSelect} />

        <section id="about" className="max-w-3xl mx-auto px-4 py-16 md:py-24 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">
            {t.nav.about}
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            {t.about.body}
          </p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">
            {t.about.contactLabel}
          </p>
          <a href="mailto:info@vinscanner.eu" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded">
            info@vinscanner.eu
          </a>
        </section>

        {!report && !loading && (
          <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { title: t.features.mileageHistory, desc: t.features.mileageHistoryDesc },
                { title: t.features.damageRecords, desc: t.features.damageRecordsDesc },
                { title: t.features.theftCheck, desc: t.features.theftCheckDesc },
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

      <AIChat key={lang} t={t} />
    </div>
  );
};

export default App;
