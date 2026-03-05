/**
 * Klientas – Gemini API kvietimai per Vercel serverless.
 * AI_API_KEY niekada neįeina į kliento bundle.
 */
import type { CarReport, ReportAnalysis, ServiceEventRecord } from '../types';
import type { TitleBrandItem } from '../constants/titleBrandTranslations';

export type ReportAnalysisResult =
  | { ok: true; data: ReportAnalysis }
  | { ok: false; error: string };

export type TranslateServiceEventsResult =
  | { ok: true; events: ServiceEventRecord[] }
  | { ok: false; error: string };

export type TranslateTitleBrandsResult =
  | { ok: true; items: Record<string, TitleBrandItem> }
  | { ok: false; error: string };

export type TranslateStringsResult =
  | { ok: true; strings: string[] }
  | { ok: false; error: string };

async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function generateMockReport(vin: string): Promise<any> {
  const data = await apiPost<Record<string, unknown>>('/api/gemini-mock-report', { vin });
  return data;
}

export async function getReportAnalysis(report: CarReport, lang: string = 'lt'): Promise<ReportAnalysisResult> {
  const res = await apiPost<ReportAnalysisResult>('/api/gemini-report-analysis', { report, lang });
  return res;
}

export async function translateServiceEventTexts(
  events: ServiceEventRecord[],
  targetLang: string
): Promise<TranslateServiceEventsResult> {
  const res = await apiPost<TranslateServiceEventsResult>('/api/gemini-translate-service-events', {
    events,
    targetLang,
  });
  return res;
}

export async function translateTitleBrands(
  items: Record<string, TitleBrandItem>,
  targetLang: string
): Promise<TranslateTitleBrandsResult> {
  const res = await apiPost<TranslateTitleBrandsResult>('/api/gemini-translate-title-brands', {
    items,
    targetLang,
  });
  return res;
}

export async function translateStrings(
  texts: string[],
  targetLang: string,
  context?: string
): Promise<TranslateStringsResult> {
  const res = await apiPost<TranslateStringsResult>('/api/gemini-translate-strings', {
    texts,
    targetLang,
    context,
  });
  return res;
}
