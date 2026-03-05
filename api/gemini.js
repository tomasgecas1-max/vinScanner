/**
 * Vercel serverless – konsoliduotas Gemini API (viena funkcija vietoj 6).
 * AI_API_KEY tik serveryje. action: chat | mockReport | reportAnalysis | translateServiceEvents | translateStrings | translateTitleBrands
 */
import { GoogleGenAI, Type } from '@google/genai';
import { captureError } from './_sentry.js';
import { LANG_NAMES } from './_gemini-shared.js';

const CHAT_SYSTEM = `Tu esi profesionalus automobilių ekspertas vardu "VinScanner AI" (vinscanner.eu). 
Tavo tikslas - padėti vartotojams suprasti automobilių patikros ataskaitas, patarti dėl pirkimo, paaiškinti techninius terminus ir įspėti apie galimas rizikas. 
Atsakyk mandagiai, profesionaliai ir objektyviai. Naudok kalbą, kuria kreipiasi vartotojas. 
Visada naudok kilometrus (km) kaip ridos matavimo vienetą.`;

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

function buildContext(report) {
  const lastMileage = report.mileageHistory?.length ? report.mileageHistory[report.mileageHistory.length - 1]?.value : null;
  const mileageStr = lastMileage != null ? `Paskutinė rida: ${lastMileage} km.` : 'Ridos duomenų nėra.';
  const damagesStr = report.damages?.length > 0 ? report.damages.map((d) => `${d.description} (${d.severity})`).join('. ') : 'Žalų įrašų nėra.';
  const theftStr = report.theftStatus === 'clear' ? 'Vagystės patikra: ne vogtas.' : report.theftStatus === 'flagged' ? 'Vagystės patikra: VOGTAS arba ieškomas!' : 'Vagystės patikra neatlikta.';
  const serviceCount = report.serviceEvents?.length ?? 0;
  const specsStr = report.technicalSpecs && Object.keys(report.technicalSpecs).length > 0
    ? Object.entries(report.technicalSpecs).map(([k, v]) => `${k}: ${v}`).join('. ')
    : 'Techninių specifikacijų nėra.';
  const junkStr = report.junkSalvageRecords?.length > 0
    ? 'Junk/Salvage: ' + report.junkSalvageRecords.map((j) => [j.entityName, j.disposition, j.location, j.obtainedDate].filter(Boolean).join(', ')).join('; ')
    : 'Junk/Salvage įrašų nėra.';
  const insStr = report.insuranceRecords?.length > 0
    ? 'Draudimas: ' + report.insuranceRecords.map((i) => [i.entityName, i.disposition, i.location, i.obtainedDate].filter(Boolean).join(', ')).join('; ')
    : 'Draudimo įrašų nėra.';
  const brandsStr = report.titleBrands?.length > 0
    ? 'Titulo ženklai: ' + report.titleBrands.map((b) => `${b.name} (${b.code})`).join(', ')
    : 'Titulo ženklų nėra.';
  const lienStr = report.lienTheftEvents?.length > 0
    ? 'Lien/Theft: ' + report.lienTheftEvents.map((e) => `${e.type}: ${e.description}`).join('; ')
    : 'Lien/Theft įrašų nėra.';
  const vinChangedStr = report.vinChanged === true ? 'VIN buvo keistas!' : '';
  const raw = report.rawApiResponses;
  const hasCarsXeHistory = !!raw?.carsxeHistory;
  const isOneAutoOnly = !hasCarsXeHistory;
  const oneAutoContextParts = [
    `Automobilis: ${report.year} ${report.make} ${report.model}, VIN: ${report.vin}.`,
    mileageStr,
    `Serviso įrašų skaičius: ${serviceCount}.`,
    damagesStr !== 'Žalų įrašų nėra.' ? `Žalos / remontai: ${damagesStr}` : null,
    theftStr,
    specsStr,
    vinChangedStr,
  ];
  const carsXeContextParts = hasCarsXeHistory ? [junkStr, insStr, brandsStr, lienStr] : [];
  return {
    context: [...oneAutoContextParts.filter(Boolean), ...carsXeContextParts].join(' '),
    hasCarsXeHistory,
    isOneAutoOnly,
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

  const action = body?.action;
  const validActions = ['chat', 'mockReport', 'reportAnalysis', 'translateServiceEvents', 'translateStrings', 'translateTitleBrands'];
  if (!action || !validActions.includes(action)) {
    return res.status(400).json({ error: 'action required: chat | mockReport | reportAnalysis | translateServiceEvents | translateStrings | translateTitleBrands' });
  }

  // --- chat ---
  if (action === 'chat') {
    if (!apiKey) return res.status(500).json({ error: 'Konfigūracijos klaida. AI_API_KEY nenustatytas Vercel.' });
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
        config: { systemInstruction: CHAT_SYSTEM, temperature: 0.7 },
      });
      const text = response?.text?.trim() || 'Nepavyko gauti atsakymo.';
      return res.status(200).json({ text });
    } catch (error) {
      captureError(error, { context: 'gemini-chat', messageLength: userPrompt.length });
      return res.status(502).json({ error: error instanceof Error ? error.message : String(error) });
    }
  }

  // --- mockReport ---
  if (action === 'mockReport') {
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
      captureError(e, { context: 'gemini-mockReport', vin: v });
    }
    await new Promise((r) => setTimeout(r, 800));
    return res.status(200).json(getLocalMockReport(v));
  }

  // --- reportAnalysis ---
  if (action === 'reportAnalysis') {
    if (!apiKey) return res.status(500).json({ ok: false, error: 'AI_API_KEY nenustatytas Vercel.' });
    const report = body?.report;
    const lang = body?.lang || 'lt';
    if (!report || typeof report !== 'object') return res.status(400).json({ ok: false, error: 'report required' });
    const { context, hasCarsXeHistory, isOneAutoOnly } = buildContext(report);
    const oneAutoInstruction = isOneAutoOnly
      ? 'KRITIŠKAI SVARBU: Ši ataskaita iš One Auto API. One Auto API NETIKRINA avarijų istorijos, junk/salvage, titulo ženklų, draudimo. NIEKADA neminėk šių temų. Vertink tik serviso istoriją, ridą, technines specifikacijas. '
      : '';
    const prompt = `Pagal šią automobilio patikros ataskaitos santrauką:
1) Išskirk galimas problemines vietas – trumpai, punktais.${hasCarsXeHistory ? ' (SALVAGE, rida, žalos, vagystė, VIN keistas)' : ' (tik tai, kas pateikta)'}
2) Išskirk stipriąsias automobilio puses.
3) Parašyk 2–3 sakinius santrauką (summary).

${oneAutoInstruction}SVARBU: Nekelk kaip problemą „trūkstama serviso istorija“. Vertink tik tai, kas pateikta.
Atsakyk kalba: ${LANG_NAMES[lang] || 'Lithuanian'}. problemAreas, strongPoints, summary – visi šia kalba.

Ataskaitos duomenys: ${context}`;
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problemAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              strongPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING },
            },
            required: ['problemAreas', 'strongPoints'],
          },
        },
      });
      const text = response?.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.status(200).json({
          ok: true,
          data: {
            problemAreas: Array.isArray(parsed.problemAreas) ? parsed.problemAreas : [],
            strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
            summary: typeof parsed.summary === 'string' ? parsed.summary : undefined,
          },
        });
      }
    } catch (err) {
      let msg = err instanceof Error ? err.message : String(err);
      if (msg === '[object Object]' && err && typeof err === 'object') {
        try {
          const ob = err?.error;
          if (ob?.code === 429 || ob?.message) msg = ob.message || JSON.stringify(ob);
        } catch (_) {}
      }
      const isQuota = /429|quota|RESOURCE_EXHAUSTED|rate\.limit/i.test(msg);
      if (isQuota) return res.status(200).json({ ok: false, error: 'Kvota viršyta. Palaukite ~1 min.' });
      captureError(err, { context: 'gemini-reportAnalysis' });
      return res.status(200).json({ ok: false, error: msg.slice(0, 280) });
    }
    return res.status(200).json({ ok: false, error: 'AI negrąžino atsakymo.' });
  }

  // --- translateServiceEvents ---
  if (action === 'translateServiceEvents') {
    if (!apiKey) return res.status(500).json({ ok: false, error: 'AI_API_KEY nenustatytas.' });
    const events = body?.events;
    const targetLang = body?.targetLang || 'lt';
    if (!Array.isArray(events) || !events.length) return res.status(200).json({ ok: true, events: [] });
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
        config: { responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } },
      });
      const text = response?.text?.trim();
      if (!text) return res.status(200).json({ ok: false, error: 'AI negrąžino vertimų.' });
      const translated = JSON.parse(text);
      if (!Array.isArray(translated) || translated.length !== texts.length) {
        return res.status(200).json({ ok: false, error: 'Vertimų skaičius nesutampa.' });
      }
      const result = events.map((e, idx) => ({ ...e, service_actions: [...(e.service_actions || [])] }));
      for (const m of mapping) result[m.eventIdx][m.field] = translated[m.textIdx] ?? events[m.eventIdx][m.field];
      for (const m of actionsMapping) result[m.eventIdx].service_actions[m.actionIdx] = translated[m.textIdx] ?? events[m.eventIdx].service_actions[m.actionIdx];
      return res.status(200).json({ ok: true, events: result });
    } catch (err) {
      captureError(err, { context: 'gemini-translateServiceEvents' });
      return res.status(200).json({ ok: false, error: (err instanceof Error ? err.message : String(err)).slice(0, 200) });
    }
  }

  // --- translateStrings ---
  if (action === 'translateStrings') {
    if (!apiKey) return res.status(500).json({ ok: false, error: 'AI_API_KEY nenustatytas.' });
    const texts = body?.texts;
    const targetLang = body?.targetLang || 'lt';
    const context = body?.context || '';
    if (!Array.isArray(texts) || !texts.length) return res.status(200).json({ ok: true, strings: [] });
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
        config: { responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } },
      });
      const text = response?.text?.trim();
      if (!text) return res.status(200).json({ ok: false, error: 'AI negrąžino vertimų.' });
      const translated = JSON.parse(text);
      if (!Array.isArray(translated) || translated.length !== texts.length) {
        return res.status(200).json({ ok: false, error: 'Vertimų skaičius nesutampa.' });
      }
      return res.status(200).json({ ok: true, strings: translated });
    } catch (err) {
      captureError(err, { context: 'gemini-translateStrings' });
      return res.status(200).json({ ok: false, error: (err instanceof Error ? err.message : String(err)).slice(0, 200) });
    }
  }

  // --- translateTitleBrands ---
  if (action === 'translateTitleBrands') {
    if (!apiKey) return res.status(500).json({ ok: false, error: 'AI_API_KEY nenustatytas.' });
    const items = body?.items;
    const targetLang = body?.targetLang || 'lt';
    if (!items || typeof items !== 'object') return res.status(400).json({ ok: false, error: 'items required' });
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
      captureError(err, { context: 'gemini-translateTitleBrands' });
      return res.status(200).json({ ok: false, error: (err instanceof Error ? err.message : String(err)).slice(0, 200) });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}
