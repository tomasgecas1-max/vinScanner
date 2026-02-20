import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CarReport, type ReportAnalysis } from '../types';
import { getReportAnalysis } from '../services/geminiService';
import type { Translations } from '../constants/translations';
// @ts-expect-error html2pdf.js neturi TypeScript tipų
import html2pdf from 'html2pdf.js';

interface ReportViewProps {
  report: CarReport;
  t: Translations;
  lang?: string;
  canSave?: boolean;
  onSaveReport?: () => Promise<void>;
  onSupplementReport?: (vin: string, opts: { useServiceHistory: boolean; useVinLookup: boolean; useVehicleSpecs?: boolean }) => Promise<void>;
  supplementLoading?: boolean;
  pendingEmailReport?: { email: string; vin: string; token?: string; reportsRemaining?: number } | null;
  onEmailWithPdfSent?: () => void;
}

/** Pavadinimai API šaltiniams ir žinomų laukų etiketės (VIN Lookup, Cartell ir kt.) */
const SOURCE_LABELS: Record<string, string> = {
  serviceHistory: 'EzyVIN Service History',
  vinLookup: 'OE VIN Lookup (Europe)',
  vehicleSpecs: 'Automobilio specifikacijos',
  vehicleIdentity: 'Experian Vehicle Identity',
  cartellVindecoder: 'Cartell VIN Decoder',
  experianAutoCheck: 'Experian AutoCheck',
  valuation: 'Brego Vertė (Valuation from VIN)',
  previousAdverts: 'Previous Adverts from VIN',
};

/** Žinomi laukai – lietuviškos etiketės. Kiti API laukai rodomi kaip techninis pavadinimas (pvz. co2_gkm). */
const FIELD_LABELS: Record<string, string> = {
  vehicle_identification_number: 'VIN',
  oem_vehicle_desc: 'OE aprašymas',
  vehicle_desc: 'Aprašymas',
  manufacturer_desc: 'Gamintojas',
  oem_model_range_desc: 'Serija / modelis',
  oem_derivative_desc: 'Derivatyvas',
  oem_model_year: 'Modelio metai',
  manufactured_year: 'Gamybos metai',
  oem_body_type_desc: 'Kėbulo tipas',
  oem_fuel_type_desc: 'Kuras',
  oem_engine_desc: 'Variklis',
  oem_transmission_type_desc: 'Pavarų dėžė',
  oem_drivetrain_desc: 'Pavara',
  power_bhp: 'Galia (AG)',
  power_kw: 'Galia (kW)',
  oem_colour_desc: 'Spalva',
  oem_interior_trim_desc: 'Interjero apdaila',
  date_last_updated: 'Atnaujinta',
  model_range_desc: 'Serija',
  model_desc: 'Modelis',
  derivative_desc: 'Derivatyvas',
  body_type_desc: 'Kėbulo tipas',
  fuel_type_desc: 'Kuras',
  transmission_desc: 'Pavarų dėžė',
  co2_gkm: 'CO₂ (g/km)',
  engine_capacity_cc: 'Darbinis tūris (cm³)',
  max_netpower_kw: 'Galia (kW)',
  colour: 'Spalva',
  registration_date: 'Registracijos data',
  first_registration_date: 'Pirmoji registracija',
  number_seats: 'Sėdimų vietų sk.',
  ncap_rating: 'Euro NCAP',
  engine: 'Variklis',
  engine_size: 'Variklio tūris',
  engine_cylinders: 'Cilindrų sk.',
  fuel_type: 'Kuras',
  transmission: 'Pavarų dėžė',
  transmission_short: 'Pavarų dėžė',
  drivetrain: 'Pavara',
  doors: 'Durų sk.',
  standard_seating: 'Sėdimų vietų sk.',
  body_style: 'Kėbulo tipas',
  style: 'Stilius',
  type: 'Tipas',
  curb_weight: 'Svoris',
  made_in: 'Pagaminta',
  make: 'Gamintojas',
  model: 'Modelis',
  year: 'Metai',
  model_year: 'Modelio metai',
  series: 'Serija',
  trim: 'Rūšis',
  manufacturer: 'Gamintojas',
};

/** Gauna visus techninius duomenis iš OE VIN Lookup arba CarsXE (Automobilio specifikacijos), priklausomai nuo to kuris API suveikė */
function getFullTechnicalData(report: CarReport): Record<string, string> {
  const raw = report.rawApiResponses as Record<string, { success?: boolean; result?: Record<string, unknown>; attributes?: Record<string, string> } | undefined> | undefined;
  const vinLookup = raw?.vinLookup;
  const vehicleSpecs = raw?.vehicleSpecs;

  if (vinLookup?.success && vinLookup?.result) {
    const r = vinLookup.result as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(r)) {
      if (v == null) continue;
      if (typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) continue;
      out[k] = Array.isArray(v) ? v.join(', ') : String(v);
    }
    if (Object.keys(out).length > 0) return out;
  }

  if (vehicleSpecs?.success && vehicleSpecs?.result?.attributes) {
    return { ...vehicleSpecs.result.attributes };
  }

  if (vehicleSpecs?.attributes) {
    return { ...vehicleSpecs.attributes };
  }

  return report.technicalSpecs;
}

function getTechnicalLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/_/g, ' ');
}

function formatValue(val: unknown, t?: { report: { yes: string; no: string } }): string {
  if (val == null) return '–';
  if (typeof val === 'boolean') return val ? (t?.report?.yes ?? 'Yes') : (t?.report?.no ?? 'No');
  return String(val);
}

const ReportView: React.FC<ReportViewProps> = ({ report, t, lang = 'lt', canSave, onSaveReport, onSupplementReport, supplementLoading, pendingEmailReport, onEmailWithPdfSent }) => {
  const [showRawApi, setShowRawApi] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saveCloudLoading, setSaveCloudLoading] = useState(false);
  const [saveCloudDone, setSaveCloudDone] = useState(false);
  const [supplementServiceHistory, setSupplementServiceHistory] = useState(true);
  const [supplementVinLookup, setSupplementVinLookup] = useState(true);
  const [supplementVehicleSpecs, setSupplementVehicleSpecs] = useState(true);
  const [reportAnalysis, setReportAnalysis] = useState<ReportAnalysis | null>(null);
  const [reportAnalysisLoading, setReportAnalysisLoading] = useState(false);
  const [reportAnalysisError, setReportAnalysisError] = useState<string | null>(null);
  const [analysisCooldownSec, setAnalysisCooldownSec] = useState(0);
  const reportPdfRef = useRef<HTMLDivElement>(null);
  const emailSentForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingEmailReport || !onEmailWithPdfSent || report.vin !== pendingEmailReport.vin) return;
    if (emailSentForRef.current === pendingEmailReport.vin) return;
    const run = async () => {
      emailSentForRef.current = pendingEmailReport.vin;
      reportPdfRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      await new Promise((r) => setTimeout(r, 3500));
      const el2 = reportPdfRef.current;
      if (!el2) {
        onEmailWithPdfSent();
        emailSentForRef.current = null;
        try {
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: pendingEmailReport.email, vin: report.vin, token: pendingEmailReport.token, reportsRemaining: pendingEmailReport.reportsRemaining }),
          });
        } catch (_) {}
        return;
      }
      let pdfBase64 = '';
      try {
        const opt = {
          margin: 10,
          image: { type: 'jpeg' as const, quality: 0.92 },
          html2canvas: { scale: 2, useCORS: true, logging: false, allowTaint: true },
          jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
        };
        const blob = await html2pdf().set(opt).from(el2).outputPdf('blob');
        if (blob && blob.size > 0) {
          pdfBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const s = reader.result as string;
              const m = s?.match(/^data:application\/pdf;base64,(.+)$/);
              resolve(m ? m[1] : '');
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
          });
        }
        await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: pendingEmailReport.email, vin: report.vin, pdfBase64, token: pendingEmailReport.token, reportsRemaining: pendingEmailReport.reportsRemaining }),
        });
      } catch (e) {
        if (typeof console !== 'undefined' && console.error) console.error('Email su PDF klaida:', e);
      }
      if (!pdfBase64) {
        try {
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: pendingEmailReport.email, vin: report.vin, token: pendingEmailReport.token, reportsRemaining: pendingEmailReport.reportsRemaining }),
          });
        } catch (_) {}
      }
      onEmailWithPdfSent();
      emailSentForRef.current = null;
    };
    run();
  }, [report.vin, pendingEmailReport, onEmailWithPdfSent]);

  useEffect(() => {
    if (analysisCooldownSec <= 0) return;
    const id = setInterval(() => {
      setAnalysisCooldownSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [analysisCooldownSec]);

  const handleRunReportAnalysis = async () => {
    setReportAnalysisError(null);
    setReportAnalysisLoading(true);
    try {
      const result = await getReportAnalysis(report);
      if (result.ok) {
        setReportAnalysis(result.data);
      } else {
        setReportAnalysisError(result.error);
        if (result.error.includes('Kvota') || result.error.includes('quota')) {
          setAnalysisCooldownSec(60);
        }
      }
    } catch (e) {
      if (typeof console !== 'undefined' && console.error) console.error('Report analysis:', e);
      setReportAnalysisError(t.report.aiAnalysisFailed);
    } finally {
      setReportAnalysisLoading(false);
    }
  };

  const handleSaveToCloud = async () => {
    if (!onSaveReport) return;
    setSaveCloudLoading(true);
    setSaveCloudDone(false);
    try {
      await onSaveReport();
      setSaveCloudDone(true);
    } catch (e) {
      if (typeof console !== 'undefined' && console.error) console.error('Save to cloud:', e);
    } finally {
      setSaveCloudLoading(false);
    }
  };

  const raw = report.rawApiResponses != null && typeof report.rawApiResponses === 'object'
    ? report.rawApiResponses as Record<string, { success?: boolean; result?: Record<string, unknown>; error?: string }>
    : null;

  const rawJson = report.rawApiResponses != null
    ? JSON.stringify(report.rawApiResponses, null, 2)
    : null;

  const handleSaveRaw = () => {
    if (!rawJson) return;
    const blob = new Blob([rawJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vinscanner-api-${report.vin}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    const el = reportPdfRef.current;
    if (!el) return;
    setPdfLoading(true);
    try {
      const filename = `vinscanner-ataskaita-${report.vin}-${new Date().toISOString().slice(0, 10)}.pdf`;
      await html2pdf()
        .set({
          margin: 10,
          filename,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(el)
        .save();
    } catch (e) {
      if (typeof console !== 'undefined' && console.error) console.error('PDF klaida:', e);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div ref={reportPdfRef} className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Ataskaitos antraštė */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full md:w-auto">
            <div className="text-indigo-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{t.report.fullReport}</div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{report.year} {report.make} {report.model}</h2>
            <div className="flex items-center gap-2 mt-2 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span className="font-mono text-sm break-all">{report.vin}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                report.theftStatus === 'clear'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  : report.theftStatus === 'flagged'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                    : 'bg-slate-200/80 text-slate-600 border border-slate-300/80'
              }`}
              title={report.theftStatus === 'unknown' ? t.report.theftUnknownTooltip : undefined}
            >
              <div
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  report.theftStatus === 'clear' ? 'bg-emerald-400' : report.theftStatus === 'flagged' ? 'bg-rose-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              {report.theftStatus === 'clear'
                ? t.report.theftClear
                : report.theftStatus === 'flagged'
                  ? t.report.theftFlagged
                  : t.report.theftUnknown}
            </div>
            {canSave && onSaveReport && (
              <button
                type="button"
                onClick={handleSaveToCloud}
                disabled={saveCloudLoading}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
                title={t.report.saveToCloud}
              >
                {saveCloudLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saveCloudDone ? (
                  <span className="text-[10px] font-bold text-emerald-300">✓</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-auto md:ml-0 disabled:opacity-60"
              title={t.report.downloadPdf}
            >
              {pdfLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              )}
            </button>
          </div>
        </div>

        {onSupplementReport && (
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">{t.report.supplementTitle}</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={supplementServiceHistory}
                  onChange={(e) => setSupplementServiceHistory(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">{SOURCE_LABELS.serviceHistory}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={supplementVinLookup}
                  onChange={(e) => setSupplementVinLookup(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">{SOURCE_LABELS.vinLookup}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={supplementVehicleSpecs}
                  onChange={(e) => setSupplementVehicleSpecs(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">{SOURCE_LABELS.vehicleSpecs}</span>
              </label>
              <button
                type="button"
                onClick={() => onSupplementReport(report.vin, { useServiceHistory: supplementServiceHistory, useVinLookup: supplementVinLookup, useVehicleSpecs: supplementVehicleSpecs })}
                disabled={supplementLoading || (!supplementServiceHistory && !supplementVinLookup && !supplementVehicleSpecs)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                {supplementLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.report.supplementLoading}
                  </>
                ) : (
                  t.report.supplementButton
                )}
              </button>
            </div>
          </div>
        )}

        {/* Techniniai duomenys – viršuje, viso ekrano plotis, 2 stulpeliai */}
        <div className="w-full px-6 sm:px-8 py-6 sm:py-8 border-t border-slate-100">
          <h4 className="text-slate-900 font-bold text-sm sm:text-base mb-4">{t.report.technicalSpecs}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {Object.entries(getFullTechnicalData(report))
              .filter(([, val]) => val != null && String(val).trim() !== '')
              .map(([key, val]) => (
              <div key={key} className="flex justify-between py-3 border-b border-slate-200/50">
                <span className="text-slate-500 text-xs sm:text-sm capitalize">
                  {key === 'fuelType' ? t.report.fuelType : key === 'power' ? t.report.power : key === 'engine' ? t.report.engine : key === 'transmission' ? t.report.transmission : key === 'bodyType' ? t.report.bodyType : key === 'colour' ? t.report.colour : key === 'co2' ? 'CO₂' : getTechnicalLabel(key)}
                </span>
                <span className="text-slate-900 text-xs sm:text-sm font-semibold text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 p-0 lg:p-8 border-t border-slate-100 lg:border-t-0">
          {/* Ridos ir serviso istorija */}
          <div className="lg:col-span-2 space-y-10 p-6 sm:p-8 lg:p-0">
            {/* Ridos sekcija */}
            <div>
              {raw?.serviceHistory?.success === false && (
                <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium flex items-center gap-3">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                  </span>
                  <span>{t.report.serviceHistoryNotFound}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-2-2"/></svg>
                  {t.report.mileageHistory}
                </h3>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">{t.report.lastMileage} {report.mileageHistory[report.mileageHistory.length - 1].value.toLocaleString()} km</span>
              </div>
              <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-2xl p-2 sm:p-4 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.mileageHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Serviso įrašai – pilna istorija iš API */}
            {report.serviceEvents && report.serviceEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                  {t.report.serviceEvents}
                </h3>
                <div className="space-y-4">
                  {report.serviceEvents.map((event, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm font-bold text-slate-800">{event.date_of_service_event}</span>
                        <span className="text-sm font-semibold text-indigo-600">
                          {event.mileage_observed.toLocaleString()} {event.mileage_unit}
                        </span>
                      </div>
                      {event.service_provider && (
                        <p className="text-xs sm:text-sm text-slate-600 mb-2">{event.service_provider}</p>
                      )}
                      {event.service_type && (
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                          {event.service_type}
                        </span>
                      )}
                      {event.service_actions && event.service_actions.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          {event.service_actions.map((action, i) => (
                            <li key={i}>{action}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Žalų sekcija */}
            <div>
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17.01"/></svg>
                {t.report.damages}
              </h3>
              <div className="space-y-4">
                {report.damages.map((damage, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-colors">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center ${damage.severity === 'high' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className="grow">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 gap-1">
                        <span className="font-bold text-sm sm:text-base text-slate-800">{damage.description}</span>
                        <span className="text-[10px] sm:text-xs font-mono text-slate-400">{damage.date}</span>
                      </div>
                      <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className="text-slate-500">{t.report.damageLabel} <strong className="text-slate-800">~{damage.estimatedCost.toLocaleString()} €</strong></span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${damage.severity === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                          {damage.severity === 'high' ? t.report.severityHigh : t.report.severityMedium}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Šoninis skydelis */}
          <div className="bg-slate-50 lg:bg-transparent p-6 sm:p-8 lg:p-0 space-y-8 border-t lg:border-t-0 border-slate-100">
            {/* Rinkos vertė */}
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h4 className="text-indigo-900 font-bold mb-4 text-sm sm:text-base">{t.report.marketValue}</h4>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1">
                ~{report.marketValue.average.toLocaleString()} €
              </div>
              <p className="text-xs text-indigo-700/70 mb-6">{t.report.marketValueBased}</p>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] sm:text-xs uppercase font-bold tracking-wider">
                  <span className="text-indigo-900/40">{t.report.min}</span>
                  <span className="text-indigo-900/40">{t.report.max}</span>
                </div>
                <div className="w-full bg-indigo-200/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-2/3 ml-[15%]"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-indigo-900">
                  <span>{report.marketValue.min.toLocaleString()} €</span>
                  <span>{report.marketValue.max.toLocaleString()} €</span>
                </div>
              </div>
            </div>

            {/* AI: problemos ir stiprybės */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <h4 className="font-bold mb-2 text-sm">
                {t.report.aiInsights}
              </h4>
              {!reportAnalysis && !reportAnalysisLoading && (
                <p className="text-[13px] text-slate-400 leading-relaxed mb-4">
                  {t.report.aiInsightsDesc}
                </p>
              )}
              {reportAnalysisLoading && (
                <div className="flex items-center gap-2 py-4 text-slate-400">
                  <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                  <span className="text-[13px]">{t.report.analyzing}</span>
                </div>
              )}
              {reportAnalysis && !reportAnalysisLoading && (
                <div className="space-y-4 mb-4">
                  {reportAnalysis.problemAreas.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                        {t.report.problemAreas}
                      </h5>
                      <ul className="space-y-1.5">
                        {reportAnalysis.problemAreas.map((item, i) => (
                          <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {reportAnalysis.strongPoints.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 mb-2">
                        {t.report.strongPoints}
                      </h5>
                      <ul className="space-y-1.5">
                        {reportAnalysis.strongPoints.map((item, i) => (
                          <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {reportAnalysisError && (
                <p className="text-[13px] text-rose-400 mb-4">{reportAnalysisError}</p>
              )}
              {!reportAnalysisLoading && (
                <button
                  type="button"
                  onClick={handleRunReportAnalysis}
                  disabled={analysisCooldownSec > 0}
                  className="w-full py-2.5 bg-indigo-600 rounded-xl text-[13px] font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {analysisCooldownSec > 0
                    ? `${t.report.retryIn} ${analysisCooldownSec} s`
                    : reportAnalysis
                      ? t.report.refreshAnalysis
                      : t.report.analyzeWithAI}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visi API šaltiniai – skaitomai */}
      {raw && Object.keys(raw).length > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
            {t.report.allApiSources}
            </h3>
            <a href="#api-raw-data" className="text-sm font-semibold text-amber-700 hover:text-amber-800 underline">
              {t.report.showRawData}
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(raw).map(([key, data]) => {
              const title = SOURCE_LABELS[key] ?? key;
              const success = data?.success === true;
              const rawResult = data?.result && typeof data.result === 'object' ? data.result : null;
              const result = key === 'vehicleSpecs' && rawResult && typeof (rawResult as { attributes?: object }).attributes === 'object'
                ? (rawResult as { attributes: object }).attributes
                : rawResult;
              const error = data?.error;
              return (
                <div key={key} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className={`px-4 py-3 border-b border-slate-100 flex items-center justify-between ${success ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                    <span className="font-bold text-sm text-slate-800">{title}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${success ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {success ? 'OK' : 'Klaida'}
                    </span>
                  </div>
                  <div className="p-4">
                    {!success && error && (
                      <p className="text-sm text-rose-600 font-medium">{error}</p>
                    )}
                    {success && result && Object.keys(result).length > 0 && (
                      <dl className="space-y-2">
                        {Object.entries(result)
                          .filter(([, v]) => v != null && v !== '')
                          .map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-2 text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                              <dt className="text-slate-500 shrink-0">
                                {FIELD_LABELS[k] ?? k.replace(/_/g, ' ')}
                              </dt>
                              <dd className="text-slate-900 font-medium text-right break-all">{formatValue(v, t)}</dd>
                            </div>
                          ))}
                      </dl>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visa informacija iš API – geltonas blokas (apačioje, scroll žemyn) */}
      <div id="api-raw-data" className="mt-10 p-5 rounded-2xl border-2 border-amber-300 bg-amber-100/90 shadow-sm">
        <button
          type="button"
          onClick={() => setShowRawApi((v) => !v)}
          className="w-full flex items-center justify-between gap-2 text-left py-4 px-5 rounded-xl bg-amber-200/90 hover:bg-amber-300/90 transition-colors border border-amber-300/80"
        >
          <span className="text-base font-bold text-amber-900">
              {rawJson ? t.report.showRawData : t.report.rawDataUnavailable}
          </span>
          {rawJson && (
            <span className="text-amber-800 text-sm font-medium">
              {showRawApi ? t.report.hide : t.report.show}
            </span>
          )}
        </button>
        {rawJson && showRawApi && (
          <div className="mt-4 space-y-4">
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto max-h-[400px] overflow-y-auto font-mono whitespace-pre-wrap break-all">
              {rawJson}
            </pre>
            <button
              type="button"
              onClick={handleSaveRaw}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              {t.report.saveAsJson}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportView;
