
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobilePlanSheet from './components/MobilePlanSheet';
import OrderEmailStepModal from './components/OrderEmailStepModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import CookieConsent from './components/CookieConsent';
import UsageInstructionsModal from './components/UsageInstructionsModal';
import AuthModal from './components/AuthModal';
import SampleReportModal from './components/SampleReportModal';
import PaymentModal from './components/PaymentModal';
import LanguageSelectionBar from './components/LanguageSelectionBar';
import Hero from './components/Hero';
import ReportView from './components/ReportView';
import MyReports from './components/MyReports';
import Pricing from './components/Pricing';
import AIChat from './components/AIChat';
import Logo from './components/Logo';
import { useAuth } from './context/AuthContext';
import { generateMockReport } from './services/geminiService';
import { fetchCarReportFromOneAuto } from './services/oneAutoApiService';
import { fetchVehicleSpecs, mapVehicleSpecsToReportFields, fetchVehicleHistory, mapCarsXeHistoryToReportFields, fetchTheftCheck, mapTheftCheckToReportFields } from './services/carsxeApiService';
import { saveReport } from './services/reportsFirestore';
import { CarReport } from './types';
import { getTranslations } from './constants/translations';
import type { LangCode } from './constants/translations';
import { useGoogleAnalytics, trackPurchase, trackVinSearch } from './hooks/useGoogleAnalytics';
import { useMetaTags } from './hooks/useMetaTags';
import { captureError } from './services/sentry';

const App: React.FC = () => {
  const { user } = useAuth();
  useGoogleAnalytics();
  const [showLanguageBar, setShowLanguageBar] = useState(false);
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem('vinscanner_lang');
    return (saved as LangCode) || 'en';
  });
  
  const setLang = (newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem('vinscanner_lang', newLang);
  };
  
  const [report, setReport] = useState<CarReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showMyReports, setShowMyReports] = useState(false);
  const [myReportsRefreshKey, setMyReportsRefreshKey] = useState(0);
  // API jungikliai – visi įjungti (Service History, VIN Lookup, Vehicle Specs, CarsXE History)
  const [useServiceHistory, setUseServiceHistory] = useState(true);
  const [useVinLookup, setUseVinLookup] = useState(true);
  const [useVehicleSpecs, setUseVehicleSpecs] = useState(true);
  const [useCarsXeHistory, setUseCarsXeHistory] = useState(true);
  const [pendingVin, setPendingVin] = useState<string | null>(null);
  const [showMobilePlanSheet, setShowMobilePlanSheet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showOrderEmailModal, setShowOrderEmailModal] = useState(false);
  const [vinForOrder, setVinForOrder] = useState<string | null>(null);
  const [planIndexForOrder, setPlanIndexForOrder] = useState<number>(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderEmail, setOrderEmail] = useState<string | null>(null);
  const [redirectOrder, setRedirectOrder] = useState<{ vin: string; email?: string; planIndex?: number; lang?: LangCode } | null>(null);
  const [pendingEmailReport, setPendingEmailReport] = useState<{ email: string; vin: string; token?: string; reportsRemaining?: number; orderId?: string; lang?: string } | null>(null);
  const [currentReportOrderId, setCurrentReportOrderId] = useState<string | null>(null);
  const [purchaseToken, setPurchaseToken] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showUsageInstructionsModal, setShowUsageInstructionsModal] = useState(false);
  const [showSampleReport, setShowSampleReport] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState<{
    reportsRemaining: number;
    reportsTotal: number;
    orderId: string | null;
    loading: boolean;
    error: boolean;
  } | null>(null);
  const [showInsufficientDataModal, setShowInsufficientDataModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  const t = getTranslations(lang);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('redirect_status') === 'succeeded' && params.get('payment_intent_client_secret')) {
      try {
        const raw = sessionStorage.getItem('vinscanner_pending_order');
        const data = raw ? JSON.parse(raw) : null;
        sessionStorage.removeItem('vinscanner_pending_order');
        if (data?.vin && typeof data.vin === 'string' && data.vin.trim().length > 5) {
          const purchaseLang = data.lang && typeof data.lang === 'string' ? (data.lang as LangCode) : undefined;
          if (purchaseLang) setLang(purchaseLang);
          setRedirectOrder({ vin: data.vin.trim(), email: data.email || undefined, planIndex: typeof data.planIndex === 'number' ? data.planIndex : 1, lang: purchaseLang });
        }
      } catch (_) {}
      window.history.replaceState({}, '', window.location.pathname || '/');
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token')?.trim();
    if (token && token.length >= 10 && !params.get('redirect_status')) {
      setPurchaseToken(token);
    }
  }, []);

  // Listen for privacy policy open event from CookieConsent
  useEffect(() => {
    const handleOpenPrivacy = () => setShowPrivacyModal(true);
    window.addEventListener('openPrivacyPolicy', handleOpenPrivacy);
    return () => window.removeEventListener('openPrivacyPolicy', handleOpenPrivacy);
  }, []);

  // Show language selection bar on first visit
  useEffect(() => {
    const hasSelected = localStorage.getItem('vinscanner_lang_selected');
    if (!hasSelected) {
      setShowLanguageBar(true);
    }
  }, []);

  const handleLanguageSelect = (selectedLang: LangCode) => {
    setLang(selectedLang);
    setShowLanguageBar(false);
  };

  const handleLanguageBarDismiss = () => {
    localStorage.setItem('vinscanner_lang_selected', 'true');
    setShowLanguageBar(false);
  };

  const handleSampleReportDemo = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);
    
    const steps = t.loading.steps;
    const durations = [800, 1000, 1200, 1000, 800];
    
    let currentProgress = 0;
    const progressPerStep = 100 / steps.length;
    
    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      const duration = durations[i] || 900;
      const targetProgress = currentProgress + progressPerStep;
      const startProgress = currentProgress;
      const startTime = Date.now();
      
      while (Date.now() - startTime < duration) {
        const elapsed = Date.now() - startTime;
        const stepProgress = (elapsed / duration) * progressPerStep;
        setProgress(Math.min(startProgress + stepProgress, targetProgress));
        await new Promise(r => setTimeout(r, 50));
      }
      
      currentProgress = targetProgress;
      setProgress(currentProgress);
    }
    
    setProgress(100);
    setLoadingStep(t.loading.ready);
    await new Promise(r => setTimeout(r, 400));
    setLoading(false);
    setShowSampleReport(true);
  };

  // Kai prisijungęs vartotojas, bet nėra token iš URL – ieškome pirkimo pagal el. paštą
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasTokenInUrl = !!params.get('token')?.trim();
    if (user?.email && !hasTokenInUrl && !purchaseToken) {
      fetch(`/api/get-purchase-by-email?email=${encodeURIComponent(user.email)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.token && (data.reportsRemaining ?? 0) > 0) {
            setPurchaseToken(data.token);
          }
        })
        .catch(() => {});
    }
  }, [user?.email, purchaseToken]);

  useEffect(() => {
    if (!purchaseToken) {
      setPurchaseInfo(null);
      return;
    }
    setPurchaseInfo((p) => ({ reportsRemaining: p?.reportsRemaining ?? 0, reportsTotal: p?.reportsTotal ?? 1, orderId: p?.orderId ?? null, loading: true, error: false }));
    fetch(`/api/get-purchase?token=${encodeURIComponent(purchaseToken)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setPurchaseInfo({
          reportsRemaining: data.reportsRemaining ?? 0,
          reportsTotal: data.reportsTotal ?? 1,
          orderId: data.orderId ?? null,
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        setPurchaseInfo((p) => ({
          reportsRemaining: p?.reportsRemaining ?? 0,
          reportsTotal: p?.reportsTotal ?? 0,
          orderId: p?.orderId ?? null,
          loading: false,
          error: true,
        }));
      });
  }, [purchaseToken]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-scroll prie ataskaitos, kai ji sugeneruojama arba pasirenkama iš istorijos
  useEffect(() => {
    if (!report || loading) return;
    const el = document.getElementById('car-report');
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [report, loading]);

  useMetaTags(t, lang);
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

  /** Trijų išskirtinių šaltinių logika: Cache → One Auto → CarsXE. Duomenys tik iš vieno šaltinio. */
  const handleSearchAndReturn = async (vin: string): Promise<CarReport | null> => {
    try {
      const vinNorm = vin.trim().toUpperCase();
      trackVinSearch(vinNorm);

      // 1. Cache – jei rasta, grąžinti ir sustoti (išjungti: VITE_SKIP_CACHE=true)
      const skipCache = import.meta.env.VITE_SKIP_CACHE === 'true' || import.meta.env.VITE_SKIP_CACHE === '1';
      if (!skipCache) {
        const cacheRes = await fetch(`/api/report-cache?vin=${encodeURIComponent(vinNorm)}`);
        if (cacheRes.ok) {
          const cacheData = await cacheRes.json();
          if (cacheData?.report) {
            return { ...cacheData.report, vin };
          }
        }
      }

      // 2. One Auto (Service History → jei rasta, papildyti VIN Lookup) – tik vienas šaltinis
      if (useServiceHistory || useVinLookup) {
        try {
          const oneAutoData = await fetchCarReportFromOneAuto(vin, {
            useServiceHistory,
            useVinLookup,
            sequential: useServiceHistory && useVinLookup,
          });
          if (oneAutoData) {
            return oneAutoData;
          }
        } catch {
          // One Auto nerado duomenų – tęsti į CarsXE
        }
      }

      // 3. CarsXE (History → jei rasta, papildyti Specs + Theft) – tik vienas šaltinis
      if (useCarsXeHistory) {
        const historyRes = await fetchVehicleHistory(vin);
        if (historyRes.success && historyRes.result) {
          const fromHistory = mapCarsXeHistoryToReportFields(historyRes.result);
          const mileageHistory = fromHistory.mileageHistory?.length
            ? fromHistory.mileageHistory
            : [{ date: new Date().toISOString().slice(0, 7), value: 0 }];
          let reportData: CarReport = {
            vin,
            make: "–",
            model: "–",
            year: 0,
            mileageHistory,
            serviceEvents: [],
            damages: fromHistory.damages ?? [],
            theftStatus: fromHistory.theftStatus ?? "unknown",
            technicalSpecs: { engine: "–", power: "–", fuelType: "–" },
            marketValue: { min: 0, max: 0, average: 0 },
            rawApiResponses: { carsxeHistory: historyRes },
          };
          if (fromHistory.titleBrands?.length) reportData.titleBrands = fromHistory.titleBrands;
          if (fromHistory.junkSalvageRecords?.length) reportData.junkSalvageRecords = fromHistory.junkSalvageRecords;
          if (fromHistory.insuranceRecords?.length) reportData.insuranceRecords = fromHistory.insuranceRecords;
          if (fromHistory.vinChanged) reportData.vinChanged = fromHistory.vinChanged;

          if (useVehicleSpecs) {
            const specsRes = await fetchVehicleSpecs(vin);
            if (specsRes.success && specsRes.result?.attributes) {
              const fromSpecs = mapVehicleSpecsToReportFields(specsRes.result.attributes);
              reportData = {
                ...reportData,
                make: fromSpecs.make ?? reportData.make,
                model: fromSpecs.model ?? reportData.model,
                year: fromSpecs.year ?? reportData.year,
                technicalSpecs: fromSpecs.technicalSpecs ?? reportData.technicalSpecs,
                rawApiResponses: { ...(reportData.rawApiResponses as object), vehicleSpecs: specsRes },
              };
            }
          }

          const theftRes = await fetchTheftCheck(vin);
          if (theftRes.success && theftRes.result) {
            const fromTheft = mapTheftCheckToReportFields(theftRes.result);
            if (fromTheft.theftStatus) reportData.theftStatus = fromTheft.theftStatus;
            if (fromTheft.lienTheftEvents?.length) reportData.lienTheftEvents = fromTheft.lienTheftEvents;
            reportData.rawApiResponses = { ...(reportData.rawApiResponses as object), carsxeTheft: theftRes };
          }

          return reportData;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const handleVinSubmit = async (vin: string) => {
    const vinTrimmed = vin.trim();
    if (vinTrimmed.length <= 5) return;
    setError(null);
    setPendingVin(vinTrimmed);

    if (purchaseToken && purchaseInfo && purchaseInfo.reportsRemaining > 0 && !purchaseInfo.loading) {
      setLoading(true);
      setReport(null);
      const userEmail = user?.email;
      
      try {
        const reportResult = await handleSearchAndReturn(vinTrimmed);
        
        if (!reportResult) {
          setErrorModalMessage(t.errors.apiFailed);
          setLoading(false);
          return;
        }
        
        const mileageCount = reportResult.mileageHistory?.length ?? 0;
        const serviceCount = reportResult.serviceEvents?.length ?? 0;
        const hasEnoughData = mileageCount >= 2 || serviceCount >= 2;
        
        if (!hasEnoughData) {
          setShowInsufficientDataModal(true);
          setReport(null);
          setLoading(false);
          return;
        }
        
        const useReportRes = await fetch('/api/use-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: purchaseToken, vin: vinTrimmed }),
        });
        const useReportData = await useReportRes.json();
        
        if (useReportData.success !== true) {
          throw new Error(useReportData.error || 'Failed');
        }
        
        const newRemaining = useReportData.reportsRemaining ?? purchaseInfo.reportsRemaining - 1;
        setPurchaseInfo((prev) =>
          prev ? { ...prev, reportsRemaining: newRemaining } : null
        );
        
        if (userEmail) {
          setPendingEmailReport({ email: userEmail, vin: vinTrimmed, token: purchaseToken, reportsRemaining: newRemaining, orderId: purchaseInfo.orderId ?? undefined, lang });
          if (purchaseInfo.orderId) setCurrentReportOrderId(purchaseInfo.orderId);
        }
        
        setReport(reportResult);
        if (user) {
          saveReport(user.uid, reportResult).then(() => setMyReportsRefreshKey((k) => k + 1)).catch(() => {});
        }
        
        fetch('/api/report-cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin: vinTrimmed, report: reportResult }),
        }).catch(() => {});
        
        setLoading(false);
      } catch {
        setErrorModalMessage(t.errors.apiFailed);
        setLoading(false);
      }
      return;
    }

    if (isMobile) {
      setShowMobilePlanSheet(true);
    } else {
      setTimeout(() => {
        const el = document.getElementById('pricing');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
    handleSearch(redirectOrder.vin, redirectOrder.email, redirectOrder.planIndex ?? 1, undefined, undefined, redirectOrder.lang);
    setRedirectOrder(null);
  }, [redirectOrder]);

  const handlePaymentPay = (vin: string, customerEmail?: string, orderId?: string, paymentIntentId?: string) => {
    if (orderId) {
      const prices = [12, 20, 27];
      trackPurchase(orderId, prices[planIndexForOrder] ?? 12);
    }
    setShowPaymentModal(false);
    setVinForOrder(null);
    setOrderEmail(null);
    setPendingVin(null);
    handleSearch(vin, customerEmail, planIndexForOrder, orderId, paymentIntentId);
  };

  const handleSearch = async (vin: string, customerEmail?: string, planIndex: number = 1, orderId?: string, paymentIntentId?: string, purchaseLang?: LangCode) => {
    const previousReport = report;
    setLoading(true);
    setReport(null);
    setError(null);
    if (orderId) {
      setCurrentReportOrderId(orderId);
    } else if (!customerEmail) {
      setCurrentReportOrderId(null);
    }
    
    let purchaseCreated = false;
    let purchaseTokenValue: string | undefined;
    let purchaseOrderId: string | undefined = orderId;
    let reportsRemainingValue = planIndex + 1;
    const emailLang = purchaseLang ?? lang;
    
    if (customerEmail && planIndex >= 1) {
      try {
        const pr = await fetch('/api/create-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: customerEmail, planIndex, vin, paymentIntentId }),
        });
        const prData = await pr.json();
        if (pr.ok && prData?.token) {
          purchaseCreated = true;
          purchaseTokenValue = prData.token;
          purchaseOrderId = prData.orderId ?? orderId;
          
          setPurchaseToken(purchaseTokenValue);
          setPurchaseInfo({
            reportsRemaining: reportsRemainingValue,
            reportsTotal: planIndex + 1,
            orderId: purchaseOrderId ?? null,
            loading: false,
            error: false,
          });
          
          if (purchaseOrderId) setCurrentReportOrderId(purchaseOrderId);
        }
      } catch (e) {
        console.error('[App] create-purchase error:', e);
        captureError(e as Error, { context: 'create-purchase', email: customerEmail });
      }
    }
    
    try {
      const vinNorm = vin.trim().toUpperCase();
      trackVinSearch(vinNorm);
      const cacheRes = await fetch(`/api/report-cache?vin=${encodeURIComponent(vinNorm)}`);
      if (cacheRes.ok) {
        const cacheData = await cacheRes.json();
        if (cacheData?.report) {
          const cached: CarReport = { ...cacheData.report, vin };
          const cachedMileageCount = cached.mileageHistory?.length ?? 0;
          const cachedServiceCount = cached.serviceEvents?.length ?? 0;
          const cachedHasEnoughData = cachedMileageCount >= 2 || cachedServiceCount >= 2;
          
          if (purchaseCreated && purchaseTokenValue) {
            if (cachedHasEnoughData) {
              try {
                const useRes = await fetch('/api/use-report', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: purchaseTokenValue, vin }),
                });
                const useData = await useRes.json();
                if (useData.success) {
                  reportsRemainingValue = useData.reportsRemaining ?? reportsRemainingValue - 1;
                  setPurchaseInfo((prev) => prev ? { ...prev, reportsRemaining: reportsRemainingValue } : null);
                }
              } catch (e) {
                console.error('[App/cached] use-report error:', e);
              }
            }
            
            if (!cachedHasEnoughData) {
              setShowInsufficientDataModal(true);
              setPendingEmailReport({ email: customerEmail!, vin, token: purchaseTokenValue, reportsRemaining: reportsRemainingValue, orderId: purchaseOrderId, lang: emailLang });
              setTimeout(() => setLoading(false), 500);
              return;
            }
            
            setPendingEmailReport({ email: customerEmail!, vin, token: purchaseTokenValue, reportsRemaining: reportsRemainingValue, orderId: purchaseOrderId, lang: emailLang });
          } else if (customerEmail) {
            setPendingEmailReport({ email: customerEmail, vin, reportsRemaining: undefined, orderId, lang: emailLang });
            if (orderId) setCurrentReportOrderId(orderId);
          }
          
          if (!cachedHasEnoughData && !customerEmail) {
            setShowInsufficientDataModal(true);
            setTimeout(() => setLoading(false), 500);
            return;
          }
          
          setReport(cached);
          if (user) {
            saveReport(user.uid, cached).then(() => setMyReportsRefreshKey((k) => k + 1)).catch(() => {});
          }
          await new Promise((resolve) => setTimeout(resolve, 400));
          setTimeout(() => setLoading(false), 500);
          return;
        }
      }
      // Trijų išskirtinių šaltinių logika: Cache → One Auto → CarsXE (naudojame handleSearchAndReturn)
      let data: CarReport | null = await handleSearchAndReturn(vin);

      const hasVinKey = !!(process.env.VIN_API_KEY);
      const mockDisabled = hasVinKey || (process.env.DISABLE_MOCK_REPORT === "true" || process.env.DISABLE_MOCK_REPORT === "1");

      if (!data) {
        if (mockDisabled) {
          setErrorModalMessage(t.errors.apiFailed);
          setLoading(false);
          return;
        }
        data = await generateMockReport(vin);
      }
      setProgress(100);
      setLoadingStep(t.loading.ready);

      const finalReport: CarReport = { ...data, vin };
      const mileageCount = finalReport.mileageHistory?.length ?? 0;
      const serviceCount = finalReport.serviceEvents?.length ?? 0;
      const hasEnoughData = mileageCount >= 2 || serviceCount >= 2;
      
      if (purchaseCreated && purchaseTokenValue) {
        if (hasEnoughData) {
          try {
            const useRes = await fetch('/api/use-report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: purchaseTokenValue, vin }),
            });
            const useData = await useRes.json();
            if (useData.success) {
              reportsRemainingValue = useData.reportsRemaining ?? reportsRemainingValue - 1;
              setPurchaseInfo((prev) => prev ? { ...prev, reportsRemaining: reportsRemainingValue } : null);
            }
          } catch (e) {
            console.error('[App] use-report error:', e);
          }
        }
        
        if (!hasEnoughData) {
          setShowInsufficientDataModal(true);
          setPendingEmailReport({ email: customerEmail!, vin, token: purchaseTokenValue, reportsRemaining: reportsRemainingValue, orderId: purchaseOrderId, lang: emailLang });
          return;
        }
        
        setPendingEmailReport({ email: customerEmail!, vin, token: purchaseTokenValue, reportsRemaining: reportsRemainingValue, orderId: purchaseOrderId, lang: emailLang });
      } else if (customerEmail) {
        setPendingEmailReport({ email: customerEmail, vin, reportsRemaining: undefined, orderId, lang: emailLang });
        if (orderId) setCurrentReportOrderId(orderId);
      }
      
      if (!hasEnoughData && !customerEmail) {
        setShowInsufficientDataModal(true);
        return;
      }
      
      setReport(finalReport);
      if (user) {
        saveReport(user.uid, finalReport).then(() => setMyReportsRefreshKey((k) => k + 1)).catch(() => {});
      }
    fetch('/api/report-cache', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vin, report: finalReport }),
    }).catch(() => {});
    await new Promise(resolve => setTimeout(resolve, 400));
  } catch (err) {
    console.error(err);
    captureError(err as Error, { context: 'handleSearch', vin });
    setError(t.errors.networkFailed);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const [supplementLoading, setSupplementLoading] = useState(false);
  const handleSupplementReport = async (vin: string, opts: { useServiceHistory: boolean; useVinLookup: boolean; useVehicleSpecs?: boolean; useCarsXeHistory?: boolean }) => {
    if (!report || (!opts.useServiceHistory && !opts.useVinLookup && !opts.useVehicleSpecs && !opts.useCarsXeHistory)) return;
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

      if (opts.useCarsXeHistory) {
        const historyRes = await fetchVehicleHistory(vin);
        if (historyRes.success && historyRes.result) {
          const fromHistory = mapCarsXeHistoryToReportFields(historyRes.result);
          if (fromHistory.mileageHistory?.length) merged.mileageHistory = fromHistory.mileageHistory;
          if (fromHistory.damages?.length) merged.damages = fromHistory.damages;
          if (fromHistory.titleBrands?.length) merged.titleBrands = fromHistory.titleBrands;
          if (fromHistory.junkSalvageRecords?.length) merged.junkSalvageRecords = fromHistory.junkSalvageRecords;
          if (fromHistory.insuranceRecords?.length) merged.insuranceRecords = fromHistory.insuranceRecords;
          if (fromHistory.vinChanged) merged.vinChanged = fromHistory.vinChanged;
          if (fromHistory.theftStatus) merged.theftStatus = fromHistory.theftStatus;
          merged.rawApiResponses = { ...(merged.rawApiResponses as object || {}), carsxeHistory: historyRes };
        }
      }

      const theftRes = await fetchTheftCheck(vin);
      if (theftRes.success && theftRes.result) {
        const fromTheft = mapTheftCheckToReportFields(theftRes.result);
        if (fromTheft.theftStatus) merged.theftStatus = fromTheft.theftStatus;
        if (fromTheft.lienTheftEvents?.length) merged.lienTheftEvents = fromTheft.lienTheftEvents;
        merged.rawApiResponses = { ...(merged.rawApiResponses as object || {}), carsxeTheft: theftRes };
      }

      setReport(merged);
      if (user) saveReport(user.uid, merged).then(() => setMyReportsRefreshKey((k) => k + 1)).catch(() => {});
    } catch (e) {
      if (typeof console !== 'undefined' && console.error) console.error('Papildymas:', e);
      captureError(e as Error, { context: 'supplementReport' });
    } finally {
      setSupplementLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar lang={lang} setLang={setLang} t={t} onMyReportsClick={() => setShowMyReports(true)} onSampleReportClick={handleSampleReportDemo} onAuthClick={() => setShowAuthModal(true)} />
      
      <main className="overflow-x-hidden">
        {purchaseToken && purchaseInfo && (
          <div className="sticky top-20 z-[90] bg-slate-50/95 backdrop-blur-sm border-b border-slate-100">
            <div className="max-w-2xl mx-auto px-4 py-3">
              <div
                className={`rounded-xl px-5 py-3 text-center ${
                  purchaseInfo.loading
                    ? 'bg-indigo-50 border border-indigo-100 text-indigo-700'
                    : purchaseInfo.error
                    ? 'bg-rose-50 border border-rose-100 text-rose-700'
                    : purchaseInfo.reportsRemaining === 0
                    ? 'bg-amber-50 border border-amber-100 text-amber-800'
                    : 'bg-indigo-50 border border-indigo-100 text-indigo-800'
                }`}
              >
                {purchaseInfo.loading && <p className="font-bold text-sm">{t.tokenMode.loading}</p>}
                {purchaseInfo.error && <p className="font-bold text-sm">{t.tokenMode.error}</p>}
                {!purchaseInfo.loading && !purchaseInfo.error && purchaseInfo.reportsRemaining === 0 && (
                  <p className="font-bold text-sm">{t.tokenMode.noReports}</p>
                )}
                {!purchaseInfo.loading && !purchaseInfo.error && purchaseInfo.reportsRemaining > 0 && (
                  <p className="font-bold text-sm">
                    {t.tokenMode.banner.replace('{n}', String(purchaseInfo.reportsRemaining)).replace('{total}', String(purchaseInfo.reportsTotal))}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <Hero
          onVinSubmit={handleVinSubmit}
          onSampleReportClick={handleSampleReportDemo}
          loading={loading}
          t={t}
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
              onSupplementReport={handleSupplementReport}
              supplementLoading={supplementLoading}
              pendingEmailReport={pendingEmailReport}
              onEmailWithPdfSent={() => setPendingEmailReport(null)}
              orderId={currentReportOrderId ?? purchaseInfo?.orderId ?? pendingEmailReport?.orderId ?? null}
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
            defaultEmail={user?.email ?? undefined}
            lang={lang}
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
            lang={lang}
            t={t}
          />
        )}
        <Pricing t={t} pendingVin={pendingVin} onPlanSelect={handlePlanSelect} />

        <section className="max-w-3xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">
            {t.about.title || 'About Us'}
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
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm font-bold">
            <button
              type="button"
              onClick={() => setShowUsageInstructionsModal(true)}
              className="text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded"
            >
              {t.footer.usageInstructionsLink}
            </button>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(true)}
              className="text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded"
            >
              {t.footer.privacyLink}
            </button>
          </div>
          <div className="text-[11px] text-slate-400 font-black tracking-[0.3em] uppercase border-t border-slate-50 pt-12">
            &copy; {new Date().getFullYear()} vinscanner.eu. All rights reserved.
          </div>
        </div>
      </footer>

      {showPrivacyModal && (
        <PrivacyPolicyModal
          open={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          lang={lang}
          closeLabel={t.pricing.close}
        />
      )}
      {showUsageInstructionsModal && (
        <UsageInstructionsModal
          open={showUsageInstructionsModal}
          onClose={() => setShowUsageInstructionsModal(false)}
          lang={lang}
          closeLabel={t.pricing.close}
        />
      )}
      {showSampleReport && (
        <SampleReportModal
          open={showSampleReport}
          onClose={() => setShowSampleReport(false)}
          t={t}
          lang={lang}
        />
      )}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} t={t} />
      
      {showInsufficientDataModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {t.errors.insufficientDataTitle || 'Duomenų nerasta'}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t.errors.insufficientData || 'Nepakanka duomenų šiam automobiliui. Kreditas nebus nuskaitytas.'}
              </p>
              {purchaseInfo && purchaseInfo.reportsRemaining > 0 && (
                <p className="text-sm text-indigo-600 font-semibold mb-6">
                  {t.tokenMode.banner.replace('{n}', String(purchaseInfo.reportsRemaining)).replace('{total}', String(purchaseInfo.reportsTotal))}
                </p>
              )}
              <button
                onClick={() => setShowInsufficientDataModal(false)}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t.pricing.close || 'Uždaryti'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {errorModalMessage && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                {t.errors.insufficientDataTitle || 'Duomenų nerasta'}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {errorModalMessage}
              </p>
              {purchaseInfo && purchaseInfo.reportsRemaining > 0 && (
                <p className="text-sm text-indigo-600 font-semibold mb-6">
                  {t.tokenMode.banner.replace('{n}', String(purchaseInfo.reportsRemaining)).replace('{total}', String(purchaseInfo.reportsTotal))}
                </p>
              )}
              <button
                onClick={() => setErrorModalMessage(null)}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t.pricing.close || 'Uždaryti'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showLanguageBar && (
        <LanguageSelectionBar onSelect={handleLanguageSelect} onDismiss={handleLanguageBarDismiss} />
      )}
      <AIChat key={lang} t={t} />
      <CookieConsent lang={lang} />
    </div>
  );
};

export default App;
