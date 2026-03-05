/**
 * Vercel serverless – Gemini ataskaitos analizė (problemos, stiprybės, santrauka).
 * AI_API_KEY tik serveryje.
 */
import { GoogleGenAI, Type } from '@google/genai';
import { captureError } from './_sentry.js';
import { LANG_NAMES } from './_gemini-shared.js';

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
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'AI_API_KEY nenustatytas Vercel.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON' });
  }

  const report = body?.report;
  const lang = body?.lang || 'lt';
  if (!report || typeof report !== 'object') {
    return res.status(400).json({ ok: false, error: 'report required' });
  }

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
    if (isQuota) {
      return res.status(200).json({ ok: false, error: 'Kvota viršyta. Palaukite ~1 min.' });
    }
    captureError(err, { context: 'gemini-report-analysis' });
    return res.status(200).json({ ok: false, error: msg.slice(0, 280) });
  }
  return res.status(200).json({ ok: false, error: 'AI negrąžino atsakymo.' });
}
