/**
 * Vercel serverless – Gemini mock ataskaita pagal VIN.
 * AI_API_KEY tik serveryje.
 */
import { GoogleGenAI, Type } from '@google/genai';
import { captureError } from './_sentry.js';

function getLocalMockReport(vin) {
  return {
    make: 'BMW',
    model: '3 Series 320d',
    year: 2019,
    mileageHistory: [
      { date: '2019-06', value: 12000 },
      { date: '2020-08', value: 45000 },
      { date: '2021-11', value: 78000 },
      { date: '2022-05', value: 95000 },
      { date: '2023-03', value: 112000 },
      { date: '2024-01', value: 124500 },
    ],
    serviceEvents: [],
    damages: [
      { date: '2022-08', description: 'Galinis kairės pusės sparnas – dažymas po įtrūkimų', estimatedCost: 450, severity: 'low' },
      { date: '2023-11', description: 'Priekinio stiklo keitimas (akmenukas)', estimatedCost: 320, severity: 'low' },
    ],
    theftStatus: 'clear',
    technicalSpecs: { engine: '2.0d 190 AG', power: '140 kW', fuelType: 'Dyzelinas' },
    marketValue: { min: 12500, max: 15200, average: 13800 },
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.AI_API_KEY ?? process.env.GEMINI_API_KEY;
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const vin = body?.vin;
  if (!vin || typeof vin !== 'string' || vin.trim().length < 6) {
    return res.status(400).json({ error: 'vin required' });
  }

  const v = String(vin).trim().slice(0, 20);
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 800));
    return res.status(200).json(getLocalMockReport(v));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Sugeneruok detalią automobilių patikros ataskaitą VIN: ${v}. SVARBU: 1) Lietuvių kalba. 2) Pridėk bent 2 pavyzdines žalas. 3) Rida km. Grąžink JSON pagal schemą.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            make: { type: Type.STRING },
            model: { type: Type.STRING },
            year: { type: Type.NUMBER },
            mileageHistory: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, value: { type: Type.NUMBER } }, required: ['date', 'value'] } },
            damages: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, description: { type: Type.STRING }, estimatedCost: { type: Type.NUMBER }, severity: { type: Type.STRING } }, required: ['date', 'description', 'estimatedCost', 'severity'] } },
            theftStatus: { type: Type.STRING },
            technicalSpecs: { type: Type.OBJECT, properties: { engine: { type: Type.STRING }, power: { type: Type.STRING }, fuelType: { type: Type.STRING } }, required: ['engine', 'power', 'fuelType'] },
            marketValue: { type: Type.OBJECT, properties: { min: { type: Type.NUMBER }, max: { type: Type.NUMBER }, average: { type: Type.NUMBER } }, required: ['min', 'max', 'average'] },
          },
          required: ['make', 'model', 'year', 'mileageHistory', 'damages', 'theftStatus', 'technicalSpecs', 'marketValue'],
        },
      },
    });
    const text = response?.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return res.status(200).json({ ...parsed, serviceEvents: parsed.serviceEvents ?? [] });
    }
  } catch (e) {
    captureError(e, { context: 'gemini-mock-report', vin: v });
  }
  await new Promise((r) => setTimeout(r, 800));
  return res.status(200).json(getLocalMockReport(v));
}
