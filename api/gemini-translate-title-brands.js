/**
 * Vercel serverless – Gemini Title Brands vertimas.
 * AI_API_KEY tik serveryje.
 */
import { GoogleGenAI, Type } from '@google/genai';
import { captureError } from './_sentry.js';
import { LANG_NAMES } from './_gemini-shared.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.AI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ ok: false, error: 'AI_API_KEY nenustatytas.' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }

  const items = body?.items;
  const targetLang = body?.targetLang || 'lt';
  if (!items || typeof items !== 'object') {
    return res.status(400).json({ ok: false, error: 'items required' });
  }
  if (targetLang === 'en') return res.status(200).json({ ok: true, items });

  const langName = LANG_NAMES[targetLang];
  if (!langName) return res.status(200).json({ ok: true, items });

  const entries = Object.entries(items);
  if (!entries.length) return res.status(200).json({ ok: true, items });

  const inputArr = entries.map(([code, it]) => ({ code, name: it?.name || '', description: it?.description || '' }));

  const prompt = `Translate NMVTIS/car title brand terms from English to ${langName}. Keep technical terms (VIN, salvage) where common.

Return JSON array, SAME ORDER. Each: { "code": "00", "name": "...", "description": "..." }

Input:
${JSON.stringify(inputArr)}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { code: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING } },
            required: ['code', 'name', 'description'],
          },
        },
      },
    });
    const text = response?.text?.trim();
    if (!text) return res.status(200).json({ ok: false, error: 'AI negrąžino vertimų.' });

    const translatedArr = JSON.parse(text);
    const result = {};
    for (let i = 0; i < entries.length; i++) {
      const [code, item] = entries[i];
      const t = translatedArr[i];
      if (t?.code === code && t?.name && t?.description) {
        result[code] = { name: t.name, description: t.description };
      } else {
        result[code] = item;
      }
    }
    return res.status(200).json({ ok: true, items: result });
  } catch (err) {
    captureError(err, { context: 'gemini-translate-title-brands' });
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(200).json({ ok: false, error: msg.slice(0, 200) });
  }
}
