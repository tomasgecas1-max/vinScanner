/**
 * Vercel serverless – Gemini tekstų vertimas.
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

  const texts = body?.texts;
  const targetLang = body?.targetLang || 'lt';
  const context = body?.context || '';

  if (!Array.isArray(texts) || !texts.length) {
    return res.status(200).json({ ok: true, strings: [] });
  }
  if (targetLang === 'en') return res.status(200).json({ ok: true, strings: texts });

  const langName = LANG_NAMES[targetLang];
  if (!langName) return res.status(200).json({ ok: true, strings: texts });

  const ctx = context ? ` Context: ${context}.` : '';
  const prompt = `Translate each text from English to ${langName}.${ctx} Preserve numbers, units (in., km), proper nouns. Return JSON array, SAME ORDER.

Input:
${texts.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    });
    const text = response?.text?.trim();
    if (!text) return res.status(200).json({ ok: false, error: 'AI negrąžino vertimų.' });

    const translated = JSON.parse(text);
    if (!Array.isArray(translated) || translated.length !== texts.length) {
      return res.status(200).json({ ok: false, error: 'Vertimų skaičius nesutampa.' });
    }
    return res.status(200).json({ ok: true, strings: translated });
  } catch (err) {
    captureError(err, { context: 'gemini-translate-strings' });
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(200).json({ ok: false, error: msg.slice(0, 200) });
  }
}
