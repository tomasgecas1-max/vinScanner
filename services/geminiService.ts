import { GoogleGenAI, Type } from "@google/genai";
import type { CarReport, ReportAnalysis, ServiceEventRecord } from "../types";

/** Lokali netikra ataskaita – naudojama be API rago arba kai API neprieinamas */
function getLocalMockReport(vin: string) {
  return {
    make: "BMW",
    model: "3 Series 320d",
    year: 2019,
    mileageHistory: [
      { date: "2019-06", value: 12000 },
      { date: "2020-08", value: 45000 },
      { date: "2021-11", value: 78000 },
      { date: "2022-05", value: 95000 },
      { date: "2023-03", value: 112000 },
      { date: "2024-01", value: 124500 },
    ],
    serviceEvents: [],
    damages: [
      { date: "2022-08", description: "Galinis kairės pusės sparnas – dažymas po įtrūkimų", estimatedCost: 450, severity: "low" as const },
      { date: "2023-11", description: "Priekinio stiklo keitimas (akmenukas)", estimatedCost: 320, severity: "low" as const },
    ],
    theftStatus: "clear" as const,
    technicalSpecs: {
      engine: "2.0d 190 AG",
      power: "140 kW",
      fuelType: "Dyzelinas",
    },
    marketValue: { min: 12500, max: 15200, average: 13800 },
  };
}

/**
 * Gauna eksperto atsakymą į vartotojo užklausą.
 */
export const getCarExpertResponse = async (userPrompt: string, carContext?: any) => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return "Konfigūracijos klaida. API raktas nenustatytas.";

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `Tu esi profesionalus automobilių ekspertas vardu "VinScanner AI" (vinscanner.eu). 
  Tavo tikslas - padėti vartotojams suprasti automobilių patikros ataskaitas, patarti dėl pirkimo, paaiškinti techninius terminus ir įspėti apie galimas rizikas. 
  Atsakyk mandagiai, profesionaliai ir objektyviai. Naudok kalbą, kuria kreipiasi vartotojas. 
  Visada naudok kilometrus (km) kaip ridos matavimo vienetą.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: { systemInstruction, temperature: 0.7 },
    });
    return response.text || "Nepavyko gauti atsakymo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ryšio klaida. Patikrink internetą arba API raktą.";
  }
};

/**
 * Sugeneruoja ataskaitą VIN numeriui. Jei nėra API rago arba API neprieinamas – grąžina lokalią netikrą ataskaitą.
 */
export const generateMockReport = async (vin: string): Promise<any> => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1200));
    return getLocalMockReport(vin);
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Sugeneruok detalią automobilių patikros ataskaitą VIN: ${vin}. 
        SVARBU: 
        1. Ataskaita turi būti LIETUVIŲ kalba.
        2. Pridėk bent 2 pavyzdines žalas (pvz. kėbulo remontas, stiklo keitimas).
        3. Rida visur turi būti KILOMETRAIS (km).
        Grąžink griežtai JSON formatu pagal schemą.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            make: { type: Type.STRING },
            model: { type: Type.STRING },
            year: { type: Type.NUMBER },
            mileageHistory: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { date: { type: Type.STRING }, value: { type: Type.NUMBER } },
                required: ["date", "value"],
              },
            },
            damages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedCost: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                },
                required: ["date", "description", "estimatedCost", "severity"],
              },
            },
            theftStatus: { type: Type.STRING },
            technicalSpecs: {
              type: Type.OBJECT,
              properties: {
                engine: { type: Type.STRING },
                power: { type: Type.STRING },
                fuelType: { type: Type.STRING },
              },
              required: ["engine", "power", "fuelType"],
            },
            marketValue: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER },
                max: { type: Type.NUMBER },
                average: { type: Type.NUMBER },
              },
              required: ["min", "max", "average"],
            },
          },
          required: [
            "make",
            "model",
            "year",
            "mileageHistory",
            "damages",
            "theftStatus",
            "technicalSpecs",
            "marketValue",
          ],
        },
      },
    });
    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return { ...parsed, serviceEvents: parsed.serviceEvents ?? [] };
    }
  } catch (error) {
    console.warn("Gemini API neprieinamas, rodoma lokali ataskaita:", error);
  }

  await new Promise((r) => setTimeout(r, 800));
  return getLocalMockReport(vin);
};

export type ReportAnalysisResult =
  | { ok: true; data: ReportAnalysis }
  | { ok: false; error: string };

/**
 * Pagal ataskaitos duomenis su Gemini AI sugeneruoja: galimas problemines vietas ir stipriąsias automobilio puses.
 */
export const getReportAnalysis = async (report: CarReport): Promise<ReportAnalysisResult> => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "API raktas nenustatytas. Pridėk AI_API_KEY į .env (lokaliai) arba Vercel → Settings → Environment Variables, tada Redeploy." };
  }

  const lastMileage = report.mileageHistory?.length
    ? report.mileageHistory[report.mileageHistory.length - 1]?.value
    : null;
  const mileageStr = lastMileage != null ? `Paskutinė rida: ${lastMileage} km.` : "Ridos duomenų nėra.";
  const damagesStr =
    report.damages?.length > 0
      ? report.damages.map((d) => `${d.description} (${d.severity})`).join(". ")
      : "Žalų įrašų nėra.";
  const theftStr =
    report.theftStatus === "clear"
      ? "Vagystės patikra: ne vogtas."
      : report.theftStatus === "flagged"
        ? "Vagystės patikra: VOGTAS arba ieškomas!"
        : "Vagystės patikra neatlikta.";
  const serviceCount = report.serviceEvents?.length ?? 0;
  const specsStr =
    report.technicalSpecs && Object.keys(report.technicalSpecs).length > 0
      ? Object.entries(report.technicalSpecs)
          .map(([k, v]) => `${k}: ${v}`)
          .join(". ")
      : "Techninių specifikacijų nėra.";

  const context = [
    `Automobilis: ${report.year} ${report.make} ${report.model}, VIN: ${report.vin}.`,
    mileageStr,
    `Serviso įrašų skaičius: ${serviceCount}.`,
    `Žalos / remontai: ${damagesStr}`,
    theftStr,
    specsStr,
  ].join(" ");

  const prompt = `Remdamasis šia automobilio patikros ataskaitos santrauka, išskirk:
1) Galimas problemines automobilio vietas arba rizikas (pvz. didelė rida, žalos, trūkstami servisai, vagystės įspėjimas) – trumpai, punktais.
2) Stipriąsias automobilio puses (pvz. nuosekli serviso istorija, maža rida, jokių žalų, geras techninis stovis) – trumpai, punktais.
Atsakyk LIETUVIŲ kalba. Kiekvienas punktas – viena aiški frazė. Jei duomenų trūksta, įvertink tik tai, kas pateikta.

Ataskaitos santrauka: ${context}`;

  const schema = {
    responseMimeType: "application/json" as const,
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        problemAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
        strongPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["problemAreas", "strongPoints"],
    },
  };

  const ai = new GoogleGenAI({ apiKey });
  const modelsToTry = ["gemini-2.5-flash"];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: schema,
      });
      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text) as ReportAnalysis;
        return {
          ok: true,
          data: {
            problemAreas: Array.isArray(parsed.problemAreas) ? parsed.problemAreas : [],
            strongPoints: Array.isArray(parsed.strongPoints) ? parsed.strongPoints : [],
          },
        };
      }
    } catch (err) {
      let msg = err instanceof Error ? err.message : String(err);
      if (msg === "[object Object]" && err && typeof err === "object") {
        try {
          const ob = (err as { error?: { code?: number; message?: string } }).error;
          if (ob?.code === 429 || ob?.message) msg = ob.message || JSON.stringify(ob);
        } catch (_) {}
      }
      const isQuota = /429|quota|RESOURCE_EXHAUSTED|rate\.limit|limit:\s*0/i.test(msg);
      if (isQuota) {
        return {
          ok: false,
          error: "Kvota viršyta (Free tier ribos). Palaukite ~1 min., tada spauskite „Analizuoti su AI“ dar kartą. Daugiau: https://ai.google.dev/gemini-api/docs/rate-limits",
        };
      }
      if (typeof console !== "undefined" && console.error) console.error("Gemini report analysis error:", err);
      const shortMsg = msg.length > 280 ? msg.slice(0, 280) + "…" : msg;
      return { ok: false, error: shortMsg };
    }
  }

  return { ok: false, error: "AI negrąžino atsakymo. Pabandykite vėliau." };
};

const LANG_NAMES: Record<string, string> = {
  lt: "Lithuanian", en: "English", de: "German", fr: "French", es: "Spanish", it: "Italian",
  pl: "Polish", nl: "Dutch", pt: "Portuguese", sv: "Swedish", uk: "Ukrainian", tr: "Turkish",
};

export type TranslateServiceEventsResult =
  | { ok: true; events: ServiceEventRecord[] }
  | { ok: false; error: string };

/**
 * Išverčia serviso istorijos komentarus (teikėjas, tipas, atlikti darbai) į pasirinktą kalbą su Gemini AI.
 */
export async function translateServiceEventTexts(
  events: ServiceEventRecord[],
  targetLang: string
): Promise<TranslateServiceEventsResult> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "API raktas nenustatytas." };
  }

  if (!events.length) return { ok: true, events: [] };

  const texts: string[] = [];
  const mapping: { eventIdx: number; field: "service_provider" | "service_type"; textIdx: number }[] = [];
  const actionsMapping: { eventIdx: number; actionIdx: number; textIdx: number }[] = [];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.service_provider) {
      mapping.push({ eventIdx: i, field: "service_provider", textIdx: texts.length });
      texts.push(e.service_provider);
    }
    if (e.service_type) {
      mapping.push({ eventIdx: i, field: "service_type", textIdx: texts.length });
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

  if (texts.length === 0) return { ok: true, events: [...events] };

  const langName = LANG_NAMES[targetLang];
  if (!langName) return { ok: true, events: [...events] }; // Kalba nepalaikoma – rodyti originalą
  const prompt = `Translate each of the following texts into ${langName}. They are automotive service history entries (provider names, service types, work descriptions). Preserve technical terms if they are commonly used in the target language. Return a JSON array with the translations in the SAME ORDER as the input. Only JSON array, no other text.

Input texts:
${texts.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });
    const text = response.text?.trim();
    if (!text) return { ok: false, error: "AI negrąžino vertimų." };

    const translated = JSON.parse(text) as string[];
    if (!Array.isArray(translated) || translated.length !== texts.length) {
      return { ok: false, error: "Vertimų skaičius nesutampa." };
    }

    const result: ServiceEventRecord[] = events.map((e, idx) => ({
      ...e,
      service_provider: e.service_provider,
      service_type: e.service_type,
      service_actions: [...(e.service_actions || [])],
    }));

    for (const m of mapping) {
      (result[m.eventIdx] as Record<string, string>)[m.field] = translated[m.textIdx] ?? events[m.eventIdx][m.field];
    }
    for (const m of actionsMapping) {
      result[m.eventIdx].service_actions[m.actionIdx] = translated[m.textIdx] ?? events[m.eventIdx].service_actions[m.actionIdx];
    }

    return { ok: true, events: result };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg.slice(0, 200) };
  }
}
