import { GoogleGenAI, Type } from "@google/genai";

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
  const apiKey = process.env.API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) return "Konfigūracijos klaida. API raktas nenustatytas.";

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `Tu esi profesionalus automobilių ekspertas vardu "VinScanner AI" (vinscanner.eu). 
  Tavo tikslas - padėti vartotojams suprasti automobilių patikros ataskaitas, patarti dėl pirkimo, paaiškinti techninius terminus ir įspėti apie galimas rizikas. 
  Atsakyk mandagiai, profesionaliai ir objektyviai. Naudok kalbą, kuria kreipiasi vartotojas. 
  Visada naudok kilometrus (km) kaip ridos matavimo vienetą.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
  const apiKey = process.env.API_KEY ?? process.env.GEMINI_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1200));
    return getLocalMockReport(vin);
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
