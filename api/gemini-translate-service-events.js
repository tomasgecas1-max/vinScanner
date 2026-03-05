/**
 * Vercel serverless – Gemini serviso įrašų vertimas.
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

  const events = body?.events;
  const targetLang = body?.targetLang || 'lt';
  if (!Array.isArray(events) || !events.length) {
    return res.status(200).json({ ok: true, events: [] });
  }

  const langName = LANG_NAMES[targetLang];
  if (!langName) return res.status(200).json({ ok: true, events });

  const texts = [];
  const mapping = [];
  const actionsMapping = [];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.service_provider) {
      mapping.push({ eventIdx: i, field: 'service_provider', textIdx: texts.length });
      texts.push(e.service_provider);
    }
    if (e.service_type) {
      mapping.push({ eventIdx: i, field: 'service_type', textIdx: texts.length });
      texts.push(e.service_type);
    }
    if (e.service_actions) {
      for (let j = 0; j < e.service_actions.length; j++) {
        const a = e.service_actions[j];
        if (a) {
          actionsMapping.push({ eventIdx: i, actionIdx: j, textIdx: texts.length });
          texts.push(a);
        }
      }
    }
  }

  if (texts.length === 0) return res.status(200).json({ ok: true, events });

  const prompt = `Translate each text into ${langName}. Automotive service history. Preserve technical terms. Return JSON array, SAME ORDER.

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

    const result = events.map((e, idx) => ({
      ...e,
      service_actions: [...(e.service_actions || [])],
    }));

    for (const m of mapping) {
      result[m.eventIdx][m.field] = translated[m.textIdx] ?? events[m.eventIdx][m.field];
    }
    for (const m of actionsMapping) {
      result[m.eventIdx].service_actions[m.actionIdx] = translated[m.textIdx] ?? events[m.eventIdx].service_actions[m.actionIdx];
    }

    return res.status(200).json({ ok: true, events: result });
  } catch (err) {
    captureError(err, { context: 'gemini-translate-service-events' });
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(200).json({ ok: false, error: msg.slice(0, 200) });
  }
}
