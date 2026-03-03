import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CarReport, type ReportAnalysis, type ServiceEventRecord } from '../types';
import { getReportAnalysis, translateServiceEventTexts, translateTitleBrands, translateStrings } from '../services/geminiService';
import { enrichReportFromRawCarsXe } from '../services/carsxeApiService';
import { getTitleBrandItems } from '../constants/titleBrandTranslations';
import type { Translations } from '../constants/translations';
import { getTranslations } from '../constants/translations';
// @ts-expect-error html2pdf.js neturi TypeScript tipų
import html2pdf from 'html2pdf.js';

interface ReportViewProps {
  report: CarReport;
  t: Translations;
  lang?: string;
  onSupplementReport?: (vin: string, opts: { useServiceHistory: boolean; useVinLookup: boolean; useVehicleSpecs?: boolean; useCarsXeHistory?: boolean }) => Promise<void>;
  supplementLoading?: boolean;
  pendingEmailReport?: { email: string; vin: string; token?: string; reportsRemaining?: number; orderId?: string; lang?: string } | null;
  onEmailWithPdfSent?: () => void;
  orderId?: string | null;
}

/** Pavadinimai API šaltiniams ir žinomų laukų etiketės (VIN Lookup, Cartell ir kt.) */
const SOURCE_LABELS: Record<string, string> = {
  serviceHistory: 'EzyVIN Service History',
  vinLookup: 'OE VIN Lookup (Europe)',
  vehicleSpecs: 'CarsXE (Automobilio specifikacijos)',
  carsxeHistory: 'CarsXE History',
  vehicleIdentity: 'Experian Vehicle Identity',
  cartellVindecoder: 'Cartell VIN Decoder',
  experianAutoCheck: 'Experian AutoCheck',
  previousAdverts: 'Previous Adverts from VIN',
};

function getTitleBrandCodes(titleBrands: { code: string }[] | undefined): Set<string> {
  if (!titleBrands?.length) return new Set();
  return new Set(titleBrands.map((b) => String(b.code).padStart(2, '0').slice(-2)));
}

type TitleBrandDetails = {
  date?: string;
  reportingEntity?: string;
  reportingEntityId?: string;
  reportingEntityCategoryCode?: string;
};

function getTitleBrandDetailsMap(
  titleBrands: { code: string; date?: string; reportingEntity?: string; reportingEntityId?: string; reportingEntityCategoryCode?: string }[] | undefined,
  rawBrands?: Array<{ code?: string; record?: unknown }>
): Record<string, TitleBrandDetails> {
  const map: Record<string, TitleBrandDetails> = {};
  if (Array.isArray(rawBrands)) {
    for (const b of rawBrands) {
      if (!b.record) continue;
      const rec = b.record as {
        VehicleBrandDate?: { Date?: string };
        ReportingEntityAbstract?: { EntityName?: string; IdentificationID?: string; ReportingEntityCategoryCode?: string };
      };
      const code = String(b.code ?? '').padStart(2, '0').slice(-2);
      const abs = rec.ReportingEntityAbstract;
      if (rec.VehicleBrandDate || abs) {
        map[code] = {
          date: rec.VehicleBrandDate?.Date?.slice(0, 10),
          reportingEntity: abs?.EntityName,
          reportingEntityId: abs?.IdentificationID,
          reportingEntityCategoryCode: abs?.ReportingEntityCategoryCode,
        };
      }
    }
  }
  if (Array.isArray(titleBrands) && Object.keys(map).length === 0) {
    for (const b of titleBrands) {
      const code = String(b.code).padStart(2, '0').slice(-2);
      if (b.date || b.reportingEntity || b.reportingEntityId) {
        map[code] = {
          date: b.date,
          reportingEntity: b.reportingEntity,
          reportingEntityId: b.reportingEntityId,
          reportingEntityCategoryCode: b.reportingEntityCategoryCode,
        };
      }
    }
  }
  return map;
}

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

/** Konvertuoja amerikietiškus vienetus į europietiškus (CarsXE duomenims) */
function convertAmericanToEuropean(value: string): string {
  const s = String(value).trim();
  if (!s) return value;

  // in., in -> cm
  const inMatch = s.match(/^([\d.,]+)\s*in\.?$/i);
  if (inMatch) {
    const n = parseFloat(inMatch[1].replace(',', '.'));
    if (!isNaN(n)) return `${(n * 2.54).toFixed(1)} cm`;
  }

  // miles/gallon, mpg, mi/gal -> L/100km (taip pat "19 / 28 mpg" formato)
  const mpgMatch = s.match(/^([\d.,]+)(?:\s*[\/–-]\s*([\d.,]+))?\s*(?:miles?\/gallon|mpg|mi\/gal)/i);
  if (mpgMatch) {
    const n1 = parseFloat(mpgMatch[1].replace(',', '.'));
    const n2 = mpgMatch[2] ? parseFloat(mpgMatch[2].replace(',', '.')) : null;
    if (!isNaN(n1) && n1 > 0) {
      const l1 = (235.215 / n1).toFixed(1);
      if (n2 != null && !isNaN(n2) && n2 > 0) {
        const l2 = (235.215 / n2).toFixed(1);
        return `${l1} / ${l2} L/100 km`;
      }
      return `${l1} L/100 km`;
    }
  }

  // lbs, lb, pounds -> kg
  const lbsMatch = s.match(/^([\d.,]+)\s*(?:lbs?|pounds?)$/i);
  if (lbsMatch) {
    const n = parseFloat(lbsMatch[1].replace(',', '.'));
    if (!isNaN(n)) return `${Math.round(n * 0.453592)} kg`;
  }

  // gal, gallons -> L
  const galMatch = s.match(/^([\d.,]+)\s*(?:gal(?:lons?)?)$/i);
  if (galMatch) {
    const n = parseFloat(galMatch[1].replace(',', '.'));
    if (!isNaN(n)) return `${(n * 3.78541).toFixed(1)} L`;
  }

  // ft, feet -> cm
  const ftMatch = s.match(/^([\d.,]+)\s*(?:ft|feet|')$/i);
  if (ftMatch) {
    const n = parseFloat(ftMatch[1].replace(',', '.'));
    if (!isNaN(n)) return `${(n * 30.48).toFixed(1)} cm`;
  }

  return value;
}

/** Gauna visus techninius duomenis iš OE VIN Lookup arba CarsXE. Kai convertToEuropean=true ir duomenys iš CarsXE, konvertuoja vienetus. */
function getFullTechnicalData(report: CarReport, convertToEuropean = true): Record<string, string> {
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

  const convert = (v: string) => (convertToEuropean ? convertAmericanToEuropean(v) : v);

  if (vehicleSpecs?.success && vehicleSpecs?.result?.attributes) {
    const attrs = vehicleSpecs.result.attributes as Record<string, string>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(attrs)) {
      out[k] = convert(v ?? '');
    }
    return out;
  }

  if (vehicleSpecs?.attributes) {
    const attrs = vehicleSpecs.attributes as Record<string, string>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(attrs)) {
      out[k] = convert(v ?? '');
    }
    return out;
  }

  return report.technicalSpecs;
}

/** Grąžina raw API key kaip skaitomą etiketę (be vertimų) */
function getRawApiLabel(key: string): string {
  return key.replace(/_/g, ' ');
}

function normalizeFieldKey(key: string): string {
  return key.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
}

function getTechnicalLabel(key: string, t: Translations): string {
  const labels = t.report?.fieldLabels ?? getTranslations('en').report?.fieldLabels;
  if (labels) {
    const norm = normalizeFieldKey(key);
    return labels[key] ?? labels[norm] ?? labels[key.replace(/\s+/g, '_')] ?? FIELD_LABELS[key] ?? key.replace(/_/g, ' ');
  }
  return FIELD_LABELS[key] ?? key.replace(/_/g, ' ');
}

function formatValue(val: unknown, t?: { report: { yes: string; no: string } }): string {
  if (val == null) return '–';
  if (typeof val === 'boolean') return val ? (t?.report?.yes ?? 'Yes') : (t?.report?.no ?? 'No');
  return String(val);
}

const ReportView: React.FC<ReportViewProps> = ({ report, t, lang = 'lt', onSupplementReport, supplementLoading, pendingEmailReport, onEmailWithPdfSent, orderId }) => {
  /** Iš raw CarsXE duomenų papildo ataskaitą – rodo VIN keitimą, junk/salvage, draudimą, lien/theft ir senesnėse išsaugotose ataskaitose */
  const displayReport = useMemo(() => enrichReportFromRawCarsXe(report), [report]);
  const [showRawApi, setShowRawApi] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [supplementServiceHistory, setSupplementServiceHistory] = useState(true);
  const [supplementVinLookup, setSupplementVinLookup] = useState(true);
  const [supplementVehicleSpecs, setSupplementVehicleSpecs] = useState(true);
  const [supplementCarsXeHistory, setSupplementCarsXeHistory] = useState(true);
  const [reportAnalysis, setReportAnalysis] = useState<ReportAnalysis | null>(null);
  const [reportAnalysisLoading, setReportAnalysisLoading] = useState(false);
  const [reportAnalysisError, setReportAnalysisError] = useState<string | null>(null);
  const [analysisCooldownSec, setAnalysisCooldownSec] = useState(0);
  const [useGeminiTranslation, setUseGeminiTranslation] = useState(true);
  const [translationCancelled, setTranslationCancelled] = useState(false);
  const showOriginalServiceTexts = !useGeminiTranslation;
  const showOriginalTitleBrands = !useGeminiTranslation;
  const [geminiTranslatedTitleBrands, setGeminiTranslatedTitleBrands] = useState<Record<string, { name: string; description: string }> | null>(null);
  const [titleBrandTranslationLoading, setTitleBrandTranslationLoading] = useState(false);
  const [titleBrandTranslationError, setTitleBrandTranslationError] = useState<string | null>(null);
  const geminiTitleBrandCacheRef = useRef<Record<string, Record<string, { name: string; description: string }>>>({});
  const [translatedTechnicalSpecs, setTranslatedTechnicalSpecs] = useState<Record<string, string> | null>(null);
  const [translatedTechnicalLabels, setTranslatedTechnicalLabels] = useState<Record<string, string> | null>(null);
  const [technicalSpecsTranslationLoading, setTechnicalSpecsTranslationLoading] = useState(false);
  const [translatedJunkSalvage, setTranslatedJunkSalvage] = useState<Array<{ entityName?: string; disposition?: string; intendedForExport?: string }> | null>(null);
  const [translatedInsurance, setTranslatedInsurance] = useState<Array<{ entityName?: string }> | null>(null);
  const [translatedLienTheft, setTranslatedLienTheft] = useState<Array<{ description: string }> | null>(null);
  const [translatedServiceEvents, setTranslatedServiceEvents] = useState<ServiceEventRecord[] | null>(null);
  const [serviceTranslationLoading, setServiceTranslationLoading] = useState(false);
  const [serviceTranslationError, setServiceTranslationError] = useState<string | null>(null);
  const reportPdfRef = useRef<HTMLDivElement>(null);
  const emailSentForRef = useRef<string | null>(null);

  useEffect(() => {
    setTranslationCancelled(false);
    setReportAnalysis(null);
    setReportAnalysisError(null);
  }, [report.vin]);

  useEffect(() => {
    if (!report.serviceEvents?.length || !lang) {
      setTranslatedServiceEvents(null);
      setServiceTranslationError(null);
      return;
    }
    let cancelled = false;
    setServiceTranslationLoading(true);
    setServiceTranslationError(null);
    translateServiceEventTexts(report.serviceEvents, lang).then((res) => {
      if (cancelled) return;
      setServiceTranslationLoading(false);
      if (res.ok) {
        setTranslatedServiceEvents(res.events);
        setServiceTranslationError(null);
      } else {
        setTranslatedServiceEvents(null);
        setServiceTranslationError(res.error ?? t.report.serviceTranslationFailed);
      }
    });
    return () => { cancelled = true; };
  }, [report.serviceEvents, lang]);

  useEffect(() => {
    if (showOriginalTitleBrands || !lang || lang === 'en') {
      setGeminiTranslatedTitleBrands(null);
      setTitleBrandTranslationLoading(false);
      setTitleBrandTranslationError(null);
      return;
    }
    const cached = geminiTitleBrandCacheRef.current[lang];
    if (cached) {
      setGeminiTranslatedTitleBrands(cached);
      setTitleBrandTranslationError(null);
      return;
    }
    let cancelled = false;
    setTitleBrandTranslationLoading(true);
    setTitleBrandTranslationError(null);
    translateTitleBrands(getTitleBrandItems('en'), lang).then((res) => {
      if (cancelled) return;
      setTitleBrandTranslationLoading(false);
      if (res.ok) {
        geminiTitleBrandCacheRef.current[lang] = res.items;
        setGeminiTranslatedTitleBrands(res.items);
        setTitleBrandTranslationError(null);
      } else {
        setGeminiTranslatedTitleBrands(null);
        setTitleBrandTranslationError(res.error ?? t.report.serviceTranslationFailed);
      }
    });
    return () => { cancelled = true; };
  }, [showOriginalTitleBrands, lang]);

  useEffect(() => {
    if (!useGeminiTranslation || !lang || lang === 'en') {
      setTranslatedTechnicalSpecs(null);
      setTranslatedTechnicalLabels(null);
      setTechnicalSpecsTranslationLoading(false);
      return;
    }
    const specs = getFullTechnicalData(displayReport);
    const entries = Object.entries(specs).filter(([, v]) => v != null && String(v).trim() !== '');
    if (!entries.length) {
      setTranslatedTechnicalSpecs(null);
      setTranslatedTechnicalLabels(null);
      return;
    }
    let cancelled = false;
    setTechnicalSpecsTranslationLoading(true);
    const keys = entries.map(([k]) => k);
    const values = entries.map(([, v]) => String(v));
    const enT = getTranslations('en');
    const labelsToTranslate = keys.map((k) => {
      if (['fuelType', 'power', 'engine', 'transmission', 'bodyType', 'colour'].includes(k)) return null;
      return getTechnicalLabel(k, enT);
    });
    const labelsFiltered = labelsToTranslate.filter((l): l is string => l != null && l.trim() !== '');
    Promise.all([
      translateStrings(values, lang, 'vehicle technical specifications'),
      labelsFiltered.length > 0 ? translateStrings(labelsFiltered, lang, 'vehicle specification category names/labels') : Promise.resolve({ ok: true as const, strings: [] }),
    ]).then(([valsRes, labelsRes]) => {
      if (cancelled) return;
      setTechnicalSpecsTranslationLoading(false);
      if (valsRes.ok) {
        const translated: Record<string, string> = {};
        entries.forEach(([k], i) => { translated[k] = valsRes.strings[i] ?? entries[i][1]; });
        setTranslatedTechnicalSpecs(translated);
      } else {
        setTranslatedTechnicalSpecs(null);
      }
      if (labelsRes.ok && labelsRes.strings.length > 0) {
        let si = 0;
        const labelMap: Record<string, string> = {};
        keys.forEach((k, i) => {
          if (labelsToTranslate[i]) {
            labelMap[k] = labelsRes.strings[si++] ?? labelsToTranslate[i]!;
          }
        });
        setTranslatedTechnicalLabels(labelMap);
      } else {
        setTranslatedTechnicalLabels(null);
      }
    });
    return () => { cancelled = true; };
  }, [useGeminiTranslation, lang, displayReport, t]);

  useEffect(() => {
    if (!useGeminiTranslation || !lang || lang === 'en') {
      setTranslatedJunkSalvage(null);
      setTranslatedInsurance(null);
      setTranslatedLienTheft(null);
      return;
    }
    const junk = displayReport.junkSalvageRecords ?? [];
    const ins = displayReport.insuranceRecords ?? [];
    const lien = displayReport.lienTheftEvents ?? [];
    let cancelled = false;

    const run = async () => {
      if (junk.length > 0) {
        const texts: string[] = [];
        const map: { idx: number; field: 'entityName' | 'disposition' | 'intendedForExport' }[] = [];
        junk.forEach((r, i) => {
          if (r.entityName) { map.push({ idx: i, field: 'entityName' }); texts.push(r.entityName); }
          if (r.disposition) { map.push({ idx: i, field: 'disposition' }); texts.push(r.disposition); }
          if (r.intendedForExport) { map.push({ idx: i, field: 'intendedForExport' }); texts.push(r.intendedForExport); }
        });
        const res = await translateStrings(texts, lang, 'junk/salvage records');
        if (cancelled) return;
        if (res.ok) {
          const out = junk.map(() => ({} as { entityName?: string; disposition?: string; intendedForExport?: string }));
          let si = 0;
          map.forEach(({ idx, field }) => { out[idx][field] = res.strings[si++]; });
          setTranslatedJunkSalvage(out);
        } else setTranslatedJunkSalvage(null);
      } else setTranslatedJunkSalvage(null);

      if (ins.length > 0) {
        const texts = ins.map(r => r.entityName ?? '');
        const toTranslate = texts.filter(Boolean);
        if (toTranslate.length === 0) { setTranslatedInsurance(null); } else {
          const res = await translateStrings(toTranslate, lang, 'insurance entity names');
          if (cancelled) return;
          if (res.ok) {
            let si = 0;
            setTranslatedInsurance(ins.map(r => ({ entityName: r.entityName ? res.strings[si++] : r.entityName })));
          } else setTranslatedInsurance(null);
        }
      } else setTranslatedInsurance(null);

      if (lien.length > 0) {
        const texts = lien.map(e => e.description ?? '');
        const res = await translateStrings(texts, lang, 'lien/theft event descriptions');
        if (cancelled) return;
        if (res.ok) setTranslatedLienTheft(lien.map((e, i) => ({ description: res.strings[i] ?? e.description ?? '' })));
        else setTranslatedLienTheft(null);
      } else setTranslatedLienTheft(null);
    };
    run();
    return () => { cancelled = true; };
  }, [useGeminiTranslation, lang, displayReport.junkSalvageRecords, displayReport.insuranceRecords, displayReport.lienTheftEvents]);

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
            body: JSON.stringify({ to: pendingEmailReport.email, vin: report.vin, lang: pendingEmailReport.lang ?? lang, token: pendingEmailReport.token, reportsRemaining: pendingEmailReport.reportsRemaining, orderId: pendingEmailReport.orderId ?? orderId }),
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
          body: JSON.stringify({ to: pendingEmailReport.email, vin: report.vin, lang: pendingEmailReport.lang ?? lang, pdfBase64, token: pendingEmailReport.token, reportsRemaining: pendingEmailReport.reportsRemaining, orderId: pendingEmailReport.orderId ?? orderId }),
        });
      } catch (e) {
        console.error('[ReportView] Email su PDF klaida:', e);
      }
      if (!pdfBase64) {
        try {
          await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: pendingEmailReport.email, vin: report.vin, lang: pendingEmailReport.lang ?? lang, token: pendingEmailReport.token, reportsRemaining: pendingEmailReport.reportsRemaining, orderId: pendingEmailReport.orderId ?? orderId }),
          });
        } catch (_) {}
      }
      onEmailWithPdfSent();
      emailSentForRef.current = null;
    };
    run();
  }, [report.vin, pendingEmailReport, onEmailWithPdfSent, lang, orderId]);

  useEffect(() => {
    if (analysisCooldownSec <= 0) return;
    const id = setInterval(() => {
      setAnalysisCooldownSec((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [analysisCooldownSec]);

  /** Automatiškai paleidžia AI analizę užkrovus ataskaitą */
  useEffect(() => {
    if (!report?.vin || reportAnalysisLoading || reportAnalysis) return;
    let cancelled = false;
    setReportAnalysisError(null);
    setReportAnalysisLoading(true);
    getReportAnalysis(displayReport, lang).then((result) => {
      if (cancelled) return;
      setReportAnalysisLoading(false);
      if (result.ok) {
        setReportAnalysis(result.data);
      } else {
        setReportAnalysisError(result.error ?? null);
        if (result.error?.includes('Kvota') || result.error?.includes('quota')) {
          setAnalysisCooldownSec(60);
        }
      }
    }).catch((e) => {
      if (cancelled) return;
      setReportAnalysisLoading(false);
      if (typeof console !== 'undefined' && console.error) console.error('Report analysis:', e);
      setReportAnalysisError(t.report.aiAnalysisFailed);
    });
    return () => { cancelled = true; };
  }, [report?.vin]);

  const handleRunReportAnalysis = async () => {
    setReportAnalysisError(null);
    setReportAnalysisLoading(true);
    try {
      const result = await getReportAnalysis(displayReport, lang);
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

  const rawApi = report.rawApiResponses as Record<string, { success?: boolean }> | undefined;
  const rawJson = report.rawApiResponses != null ? JSON.stringify(report.rawApiResponses, null, 2) : null;

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
          margin: 12,
          filename,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css'], avoid: '.pdf-avoid-break' },
        })
        .from(el)
        .save();
    } catch (e) {
      if (typeof console !== 'undefined' && console.error) console.error('PDF klaida:', e);
    } finally {
      setPdfLoading(false);
    }
  };

  const translationLoading = useGeminiTranslation && lang !== 'en' && (
    serviceTranslationLoading || titleBrandTranslationLoading || technicalSpecsTranslationLoading
  );
  const showTranslationOverlay = translationLoading && !translationCancelled;

  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!showTranslationOverlay) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setAnimatedProgress(0);
      return;
    }
    const start = Date.now();
    setAnimatedProgress(0);
    progressIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const target = Math.min(90, elapsed * 7.5);
      setAnimatedProgress(target);
    }, 150);
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [showTranslationOverlay]);

  const displayProgress = Math.round(animatedProgress);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
      {showTranslationOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-stretch gap-3 rounded-2xl border border-slate-200 bg-white shadow-xl p-6 min-w-[260px] sm:min-w-[300px] animate-in fade-in zoom-in-95 duration-200">
            <p className="text-slate-900 font-bold text-sm text-center">{t.report.translatingReport ?? 'Translating…'}</p>
            <p className="text-indigo-600 text-xs uppercase tracking-wider font-medium text-center">{lang.toUpperCase()}</p>
            <div className="w-full">
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
              <p className="text-slate-500 text-[10px] mt-1 text-center font-medium">{Math.round(displayProgress)}%</p>
            </div>
            <button
              type="button"
              onClick={() => setTranslationCancelled(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              {t.report.cancelTranslation ?? 'Cancel translation'}
            </button>
          </div>
        </div>
      )}
      <div ref={reportPdfRef} className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <style>{`.pdf-avoid-break { break-inside: avoid; page-break-inside: avoid; }`}</style>
        {/* Ataskaitos antraštė */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="w-full md:w-auto">
            <div className="text-indigo-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{t.report.fullReport}</div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{displayReport.year} {displayReport.make} {displayReport.model}</h2>
            <div className="flex items-center gap-2 mt-2 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span className="font-mono text-sm break-all">{displayReport.vin}</span>
            </div>
            {orderId && (
              <div className="flex items-center gap-2 mt-1 opacity-70">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span className="font-mono text-sm">{lang === 'lt' ? 'Užsakymo Nr.' : 'Order No.'} {orderId}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
            {lang !== 'en' && (
              <button
                type="button"
                onClick={() => setUseGeminiTranslation(!useGeminiTranslation)}
                title={useGeminiTranslation ? (t.report.showOriginal ?? 'Show original') : (t.report.translateReportWithGemini ?? 'Translate report with Gemini')}
                className={`flex items-center gap-2 shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 ${
                  useGeminiTranslation
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400'
                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/20'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
                <span className="whitespace-nowrap">{useGeminiTranslation ? (t.report.showOriginal ?? 'Show original') : (t.report.translateReportWithGemini ?? 'Translate')}</span>
              </button>
            )}
            <div
              className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                displayReport.theftStatus === 'flagged'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                  : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/50'
              }`}
              title={displayReport.theftStatus === 'unknown' ? t.report.theftUnknownTooltip : undefined}
            >
              {displayReport.theftStatus === 'flagged' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-500">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              )}
              <span className="hidden sm:inline">
                {displayReport.theftStatus === 'flagged'
                  ? t.report.theftFlagged
                  : (t.report.theftNoDataFound ?? t.report.theftClear)}
              </span>
              <span className="sm:hidden">
                {displayReport.theftStatus === 'flagged' ? '!' : '✓'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-60 shrink-0"
              title={t.report.downloadPdf}
            >
              {pdfLoading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[18px] sm:h-[18px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Techniniai duomenys – viršuje, viso ekrano plotis, 2 stulpeliai */}
        <div className="pdf-avoid-break w-full px-6 sm:px-8 py-6 sm:py-8 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h4 className="text-slate-900 font-bold text-sm sm:text-base">{t.report.technicalSpecs}</h4>
            {useGeminiTranslation && technicalSpecsTranslationLoading && (
              <span className="text-xs text-indigo-600">{t.report.translatingReport ?? 'Translating…'}</span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {Object.entries(getFullTechnicalData(displayReport, useGeminiTranslation))
              .filter(([, val]) => val != null && String(val).trim() !== '')
              .map(([key, val]) => {
                const displayVal = useGeminiTranslation && translatedTechnicalSpecs?.[key] != null
                  ? translatedTechnicalSpecs[key]
                  : val;
                const origVal = val;
                const showOrig = useGeminiTranslation && origVal && displayVal !== origVal;
                const label = useGeminiTranslation
                  ? (key === 'fuelType' ? t.report.fuelType : key === 'power' ? t.report.power : key === 'engine' ? t.report.engine : key === 'transmission' ? t.report.transmission : key === 'bodyType' ? t.report.bodyType : key === 'colour' ? t.report.colour : key === 'co2' ? 'CO₂' : (translatedTechnicalLabels?.[key] ?? getTechnicalLabel(key, t)))
                  : getRawApiLabel(key);
                const enReport = getTranslations('en').report;
                const origLabel = (key === 'fuelType' ? enReport?.fuelType : key === 'power' ? enReport?.power : key === 'engine' ? enReport?.engine : key === 'transmission' ? enReport?.transmission : key === 'bodyType' ? enReport?.bodyType : key === 'colour' ? enReport?.colour : key === 'co2' ? 'CO₂' : undefined) ?? (getTechnicalLabel(key, getTranslations('en')) || key.replace(/_/g, ' '));
                const showOrigLabel = useGeminiTranslation && !!origLabel && label !== origLabel && lang !== 'en';
                return (
              <div key={key} className="flex justify-between py-3 border-b border-slate-200/50">
                <span className="text-slate-500 text-xs sm:text-sm capitalize">
                  {label}
                  {showOrigLabel && <span className="font-normal text-slate-400 ml-1">({origLabel})</span>}
                </span>
                <span className="text-slate-900 text-xs sm:text-sm font-semibold text-right">
                  {displayVal}
                  {showOrig && <span className="block text-[10px] font-normal text-slate-400 mt-0.5">({origVal})</span>}
                </span>
              </div>
                );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 p-0 lg:p-8 border-t border-slate-100 lg:border-t-0">
          {/* Ridos ir serviso istorija */}
          <div className="lg:col-span-2 space-y-10 p-6 sm:p-8 lg:p-0">
            {/* Ridos sekcija */}
            <div className="pdf-avoid-break">
              {rawApi?.serviceHistory?.success === false && (
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
                <span className="text-xs sm:text-sm text-slate-500 font-medium">{t.report.lastMileage} {displayReport.mileageHistory[displayReport.mileageHistory.length - 1].value.toLocaleString()} km</span>
              </div>
              <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-2xl p-2 sm:p-4 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayReport.mileageHistory}>
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
            {displayReport.serviceEvents && displayReport.serviceEvents.length > 0 && (
              <div className="pdf-avoid-break">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                    {t.report.serviceEvents}
                  </h3>
                  {useGeminiTranslation && (
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{lang.toUpperCase()}</span>
                  )}
                </div>
                {serviceTranslationLoading && (
                  <p className="text-sm text-indigo-600 font-medium mb-4 animate-pulse">{t.report.translatingServiceComments}</p>
                )}
                {serviceTranslationError && !serviceTranslationLoading && (
                  <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>{t.report.serviceTranslationFailed}</span>
                  </div>
                )}
                <div className="space-y-4">
                  {(showOriginalServiceTexts ? report.serviceEvents : (translatedServiceEvents ?? report.serviceEvents)).map((event, idx) => {
                    const orig = report.serviceEvents?.[idx];
                    const showOrig = useGeminiTranslation && orig && translatedServiceEvents?.[idx];
                    return (
                    <div key={idx} className="pdf-avoid-break p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm font-bold text-slate-800">{event.date_of_service_event}</span>
                        <span className="text-sm font-semibold text-indigo-600">
                          {event.mileage_observed.toLocaleString()} {event.mileage_unit}
                        </span>
                      </div>
                      {event.service_provider && (
                        <p className="text-xs sm:text-sm text-slate-600 mb-2">
                          {event.service_provider}
                          {showOrig && orig.service_provider && orig.service_provider !== event.service_provider && (
                            <span className="block text-[10px] text-slate-400 mt-0.5">({orig.service_provider})</span>
                          )}
                        </p>
                      )}
                      {event.service_type && (
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                          {event.service_type}
                          {showOrig && orig?.service_type && orig.service_type !== event.service_type && (
                            <span className="ml-1 font-normal normal-case text-indigo-500/80">({orig.service_type})</span>
                          )}
                        </span>
                      )}
                      {event.service_actions && event.service_actions.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          {event.service_actions.map((action, i) => (
                            <li key={i}>
                              {action}
                              {showOrig && orig?.service_actions?.[i] && orig.service_actions[i] !== action && (
                                <span className="block text-[10px] text-slate-400 ml-4 mt-0.5">({orig.service_actions[i]})</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIN buvo keistas */}
            {displayReport.vinChanged && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-amber-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span className="font-semibold">{t.report.vinChanged ?? 'VIN was changed'}</span>
              </div>
            )}

            {/* Junk & Salvage įrašai */}
            {displayReport.junkSalvageRecords && displayReport.junkSalvageRecords.length > 0 && (
              <div className="pdf-avoid-break">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  {t.report.junkSalvage ?? 'Junk & Salvage records'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{t.report.junkSalvageDesc ?? 'Vehicle history from junk and salvage auctions'}</p>
                <div className="space-y-4">
                  {displayReport.junkSalvageRecords.map((r, idx) => {
                    const tJ = useGeminiTranslation && translatedJunkSalvage?.[idx];
                    const dispEntity = tJ?.entityName ?? r.entityName;
                    const dispDisposition = tJ?.disposition ?? r.disposition;
                    const dispExport = tJ?.intendedForExport ?? r.intendedForExport;
                    const showOrig = useGeminiTranslation && tJ;
                    return (
                    <div key={idx} className="pdf-avoid-break p-5 rounded-2xl border border-amber-100 bg-amber-50/50 hover:border-amber-200 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {dispEntity && (
                          <span className="font-semibold text-slate-900">
                            {dispEntity}
                            {showOrig && r.entityName && r.entityName !== dispEntity && <span className="block text-[10px] font-normal text-slate-400">({r.entityName})</span>}
                          </span>
                        )}
                        {dispDisposition && (
                          <span className="text-sm font-medium text-amber-700 px-2 py-0.5 rounded bg-amber-100/80">
                            {dispDisposition}
                            {showOrig && r.disposition && r.disposition !== dispDisposition && <span className="text-slate-400 ml-1 text-xs">({r.disposition})</span>}
                          </span>
                        )}
                        {r.location && <span className="text-xs text-slate-500">{r.location}</span>}
                        {r.obtainedDate && <span className="text-xs text-slate-500">{r.obtainedDate}</span>}
                      </div>
                      {dispExport && (
                        <p className="text-xs text-slate-500 mt-1">
                          {t.report.intendedForExport ?? 'Export'}: {dispExport}
                          {showOrig && r.intendedForExport && r.intendedForExport !== dispExport && <span className="text-slate-400 ml-1">({r.intendedForExport})</span>}
                        </p>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Draudimo įrašai */}
            {displayReport.insuranceRecords && displayReport.insuranceRecords.length > 0 && (
              <div className="pdf-avoid-break">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  {t.report.insuranceRecords ?? 'Insurance records'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{t.report.insuranceRecordsDesc ?? 'Insurance companies that have reported on this vehicle'}</p>
                <div className="space-y-4">
                  {displayReport.insuranceRecords.map((r, idx) => {
                    const tI = useGeminiTranslation && translatedInsurance?.[idx];
                    const entityName = tI?.entityName ?? r.entityName;
                    const showOrig = useGeminiTranslation && tI && r.entityName && r.entityName !== entityName;
                    return (
                    <div key={idx} className="pdf-avoid-break p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {entityName && (
                          <span className="font-semibold text-slate-900">
                            {entityName}
                            {showOrig && <span className="block text-[10px] font-normal text-slate-400">({r.entityName})</span>}
                          </span>
                        )}
                        {r.location && <span className="text-xs text-slate-500">{r.location}</span>}
                        {r.obtainedDate && <span className="text-xs text-slate-500">{r.obtainedDate}</span>}
                      </div>
                      {r.disposition && (
                        <p className="text-sm font-medium text-amber-700 mt-1">{r.disposition}</p>
                      )}
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Įkeitimai / vagystės įvykiai */}
            {displayReport.lienTheftEvents && displayReport.lienTheftEvents.length > 0 && (
              <div className="pdf-avoid-break">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                  {t.report.lienTheftEvents ?? 'Lien & Theft events'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{t.report.lienTheftEventsDesc ?? 'Lien and theft records from Lien & Theft Check'}</p>
                <div className="space-y-4">
                  {displayReport.lienTheftEvents.map((e, idx) => {
                    const tL = useGeminiTranslation && translatedLienTheft?.[idx];
                    const desc = tL?.description ?? e.description;
                    const showOrig = useGeminiTranslation && tL && e.description && e.description !== desc;
                    return (
                    <div key={idx} className="pdf-avoid-break p-5 rounded-2xl border border-rose-100 bg-rose-50/50 hover:border-rose-200 transition-colors">
                      <p className="font-semibold text-slate-900">
                        {desc}
                        {showOrig && <span className="block text-[10px] font-normal text-slate-400 mt-0.5">({e.description})</span>}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500">
                        {e.location && <span>{e.location}</span>}
                        {e.date && <span>{e.date}</span>}
                        {e.lienHolder && <span>{e.lienHolder}</span>}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pavadinimai ant titulo – visi galimi punktai, žalia ✓ neregistruota / raudona ⚠ registruota */}
            {((displayReport.rawApiResponses as Record<string, unknown>)?.carsxeHistory != null || (displayReport.titleBrands && displayReport.titleBrands.length > 0)) && (
              <div className="pdf-avoid-break">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  {t.report.titleBrands ?? 'Title brands'}
                </h3>
                <p className="text-sm text-slate-600 mb-4">{t.report.titleBrandsDesc ?? 'CarsXE / NMVTIS brands from vehicle history'}</p>

                {useGeminiTranslation && titleBrandTranslationLoading && (
                  <p className="mb-4 text-sm text-indigo-600 font-medium">{t.report?.titleBrandTranslating ?? 'Translating…'}</p>
                )}
                {useGeminiTranslation && titleBrandTranslationError && !titleBrandTranslationLoading && (
                  <div className="mb-4 p-3 rounded-xl border border-amber-200 bg-amber-50/80">
                    <p className="text-sm text-amber-800 font-medium">{titleBrandTranslationError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {Object.entries(
                    showOriginalTitleBrands
                      ? getTitleBrandItems('en')
                      : (lang === 'en' ? getTitleBrandItems('en') : (geminiTranslatedTitleBrands ?? getTitleBrandItems(lang)))
                  )
                    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
                    .map(([code, { name, description }]) => {
                      const codeNorm = String(code).padStart(2, '0').slice(-2);
                      const codesSet = getTitleBrandCodes(displayReport.titleBrands);
                      const registered = codesSet.has(codeNorm);
                      const rawHistory = (displayReport.rawApiResponses as Record<string, { result?: { brandsInformation?: unknown[] } }>)?.carsxeHistory;
                      const rawBrands = rawHistory?.result?.brandsInformation as Array<{ code?: string; record?: unknown }> | undefined;
                      const detailsMap = getTitleBrandDetailsMap(displayReport.titleBrands, rawBrands);
                      const details = detailsMap[codeNorm];
                      const isNeutralOrGood = ['00', '68'].includes(codeNorm);
                      const showGreen = !registered || (registered && isNeutralOrGood);
                      const enItem = getTitleBrandItems('en')[code];
                      const showOrig = useGeminiTranslation && lang !== 'en' && enItem && (enItem.name !== name || (enItem.description && enItem.description !== description));
                      return (
                        <div key={code} className={`pdf-avoid-break p-4 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-start gap-3 ${showGreen ? 'border-emerald-200 bg-emerald-50/50' : 'border-2 border-rose-400 bg-rose-50 shadow-md shadow-rose-200/60 ring-1 ring-rose-300/50'}`}>
                          <div className="flex items-center shrink-0">
                            {showGreen ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-rose-600 shrink-0">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                <line x1="12" y1="9" x2="12" y2="13"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{code}</span>
                              <span className="font-semibold text-slate-900">
                                {name}
                                {showOrig && enItem?.name && enItem.name !== name && <span className="block text-[10px] font-normal text-slate-400">({enItem.name})</span>}
                              </span>
                              <span className={`ml-auto shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${showGreen ? 'text-emerald-600 bg-emerald-100/80' : 'bg-rose-500 text-white shadow-sm'}`}>
                                {showGreen ? (t.report.titleBrandNotRegistered ?? 'Not registered') : (t.report.titleBrandRegistered ?? 'Registered')}
                              </span>
                            </div>
                            {description && (
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {description}
                                {showOrig && enItem?.description && enItem.description !== description && <span className="block text-[10px] text-slate-400 mt-0.5">({enItem.description})</span>}
                              </p>
                            )}
                            {registered && (details?.date || details?.reportingEntity || details?.reportingEntityId) && (
                              <div className="text-xs text-slate-500 mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                                {(details.reportingEntity || details.reportingEntityId) && (
                                  <span><span className="font-medium text-slate-600">{t.report.titleBrandRegisteredAt ?? 'Location'}:</span> {details.reportingEntity ?? details.reportingEntityId}{details.reportingEntity && details.reportingEntityId ? ` (${details.reportingEntityId})` : ''}</span>
                                )}
                                {details.date && (
                                  <span><span className="font-medium text-slate-600">{t.report.titleBrandRegisteredDate ?? 'Date'}:</span> {details.date}</span>
                                )}
                                {details.reportingEntityCategoryCode && (
                                  <span><span className="font-medium text-slate-600">{t.report.titleBrandCategory ?? 'Category'}:</span> {details.reportingEntityCategoryCode}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            </div>

          {/* Šoninis skydelis */}
          <div className="bg-slate-50 lg:bg-transparent p-6 sm:p-8 lg:p-0 space-y-8 border-t lg:border-t-0 border-slate-100">
            {/* AI: problemos ir stiprybės */}
            <div className="pdf-avoid-break bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
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
                  {reportAnalysis.summary && (
                    <p className="text-[13px] text-slate-300 leading-relaxed mb-3">
                      {reportAnalysis.summary}
                    </p>
                  )}
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

      {/* Laikinai: geltonas blokas – kokie duomenys gauti iš API endpoint */}
      <div id="api-raw-data" className="mt-10 mx-4 sm:mx-6 mb-8 p-5 rounded-2xl border-2 border-amber-300 bg-amber-100/90 shadow-sm">
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
