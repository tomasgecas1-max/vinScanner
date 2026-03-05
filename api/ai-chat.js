/**
 * Vercel serverless – AI eksperto atsakymas (Gemini).
 * AI_API_KEY saugomas tik serveryje, niekada neįeina į kliento bundle.
 */
import { GoogleGenAI } from '@google/genai';
import { captureError } from './_sentry.js';

const SYSTEM_INSTRUCTION = `Tu esi profesionalus automobilių ekspertas vardu "VinScanner AI" (vinscanner.eu). 
Tavo tikslas - padėti vartotojams suprasti automobilių patikros ataskaitas, patarti dėl pirkimo, paaiškinti techninius terminus ir įspėti apie galimas rizikas. 
Atsakyk mandagiai, profesionaliai ir objektyviai. Naudok kalbą, kuria kreipiasi vartotojas. 
Visada naudok kilometrus (km) kaip ridos matavimo vienetą.`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.AI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Konfigūracijos klaida. AI_API_KEY nenustatytas Vercel.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const message = body?.message;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'message required' });
  }

  const userPrompt = String(message).trim().slice(0, 4000);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
    });
    const text = response?.text?.trim() || 'Nepavyko gauti atsakymo.';
    return res.status(200).json({ text });
  } catch (error) {
    captureError(error, { context: 'ai-chat', messageLength: userPrompt.length });
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(502).json({ error: msg });
  }
}
