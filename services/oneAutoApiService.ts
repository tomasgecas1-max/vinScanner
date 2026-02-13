/**
 * One Auto API integracija (EzyVIN Service History + VIN Lookup).
 * Dokumentacija: https://docs.oneautoapi.com/knowledgebase/working-with-asynchronous-api-methods/
 * Postman/OpenAPI: postmanFull.json (sandbox.oneautoapi.com / api.oneautoapi.com)
 */

import type { CarReport, ServiceEventRecord } from "../types";

const BASE_URL = "https://api.oneautoapi.com";
const SANDBOX_URL = "https://sandbox.oneautoapi.com";

type OneAutoEnv = "live" | "sandbox";

function getBaseUrl(env: OneAutoEnv = "live"): string {
  return env === "sandbox" ? SANDBOX_URL : BASE_URL;
}

function getApiKey(): string | undefined {
  return (typeof process !== "undefined" && process.env?.ONE_AUTO_API_KEY) || undefined;
}

/** Jei true – kviečiamas tik Vehicle Identity (ne Service History, ne VIN Lookup), kad nešviestų 2,5 € už istoriją. */
function isVehicleIdentityOnly(): boolean {
  const v = typeof process !== "undefined" ? process.env?.ONE_AUTO_VEHICLE_IDENTITY_ONLY : undefined;
  return v === "true" || v === "1";
}

/** Jei true – Service History nekvietiname (ataskaita kraunasi greitai, bet be serviso įrašų). Naudinga, kai Ezyvin ilgai atsako ar 403. */
function isServiceHistorySkipped(): boolean {
  const v = typeof process !== "undefined" ? process.env?.ONE_AUTO_SKIP_SERVICE_HISTORY : undefined;
  return v === "true" || v === "1";
}

/** EzyVIN Service History – asinchroninis: 202 Accepted, tada pollinti. Laukiama max ~18s (6×3s), po to – „istorija nerasta“. */
async function fetchServiceHistory(
  vin: string,
  apiKey: string,
  baseUrl: string,
  options?: { returnDataInCallback?: boolean; maxPollAttempts?: number; pollIntervalMs?: number }
): Promise<{ success: boolean; result?: EzyVinServiceHistoryResult; error?: string }> {
  const { maxPollAttempts = 6, pollIntervalMs = 3000 } = options ?? {};
  const url = new URL("/ezyvin/servicehistory/", baseUrl);
  url.searchParams.set("vehicle_identification_number", vin);
  url.searchParams.set("return_data_in_callback", "false");

  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    Accept: "application/json",
  };

  for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
    const res = await fetch(url.toString(), { method: "GET", headers });
    const status = res.status;

    if (status === 200) {
      const data = await res.json();
      return data;
    }
    if (status === 202) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      continue;
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, error: (err as { error?: string }).error || res.statusText || `HTTP ${status}` };
  }

  return {
    success: false,
    error: "Serviso istorija nerasta – atsakymas negaunamas per nustatytą laiką.",
  };
}

/** EzyVIN VIN Lookup – OE duomenys iš VIN (gali būti 202). Laukiama max ~18s (6×3s). */
async function fetchVinLookup(
  vin: string,
  apiKey: string,
  baseUrl: string,
  options?: { maxPollAttempts?: number; pollIntervalMs?: number }
): Promise<{ success: boolean; result?: EzyVinLookupResult; error?: string }> {
  const { maxPollAttempts = 6, pollIntervalMs = 3000 } = options ?? {};
  const url = new URL("/ezyvin/vinlookup/", baseUrl);
  url.searchParams.set("vehicle_identification_number", vin);

  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    Accept: "application/json",
  };

  for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
    const res = await fetch(url.toString(), { method: "GET", headers });
    const status = res.status;

    if (status === 200) {
      const data = await res.json();
      return data;
    }
    if (status === 202) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      continue;
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, error: (err as { error?: string }).error || res.statusText || `HTTP ${status}` };
  }

  return { success: false, error: "VIN Lookup negaunamas per nustatytą laiką." };
}

/** Brego – rinkos vertė pagal VIN ir ridą (synchronous, GET) */
async function fetchBregoValuation(
  vin: string,
  currentMileageKm: number,
  apiKey: string,
  baseUrl: string
): Promise<{ success: boolean; result?: BregoValuationResult; error?: string }> {
  const url = new URL("/brego/valuationfromvin/v2", baseUrl);
  url.searchParams.set("vehicle_identification_number", vin);
  // Brego API dažniausiai naudoja miles – konvertuojame jei reikia
  const mileageForApi = currentMileageKm > 0 ? Math.round(currentMileageKm / 1.60934) : 0;
  url.searchParams.set("current_mileage", String(mileageForApi));

  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    Accept: "application/json",
  };

  try {
    const res = await fetch(url.toString(), { method: "GET", headers });
    if (res.status !== 200) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: (err as { error?: string }).error || res.statusText };
    }
    return await res.json();
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

interface BregoValuationResult {
  retail_low_valuation?: number;
  retail_average_valuation?: number;
  retail_high_valuation?: number;
  vehicle_desc?: string;
  currency_unit?: string;
}

/** Percayso – buvę skelbimai pagal VIN (synchronous GET) */
async function fetchPreviousAdvertsFromVin(
  vin: string,
  apiKey: string,
  baseUrl: string
): Promise<{ success: boolean; result?: unknown; error?: string }> {
  const url = new URL("/percayso/previousadvertsfromvin/", baseUrl);
  url.searchParams.set("vehicle_identification_number", vin);
  const headers: Record<string, string> = { "x-api-key": apiKey, Accept: "application/json" };
  try {
    const res = await fetch(url.toString(), { method: "GET", headers });
    const body = await res.json().catch(() => ({}));
    if (res.status !== 200) {
      const msg = (body as { error?: string }).error || res.statusText || `HTTP ${res.status}`;
      return { success: false, error: `Previous Adverts (${res.status}): ${msg}` };
    }
    if (!(body as { success?: boolean }).success && (body as { error?: string }).error) {
      return { success: false, error: (body as { error: string }).error };
    }
    return body;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

/** Experian Vehicle Identity – DVLA duomenys (UK). API reikalauja tikro UK VRM; kvietiname tik kai vrm pateiktas. */
async function fetchVehicleIdentity(
  vin: string,
  apiKey: string,
  baseUrl: string,
  vrm?: string
): Promise<{ success: boolean; result?: VehicleIdentityResult; error?: string }> {
  const vrmVal = (vrm ?? "").trim();
  if (!vrmVal) {
    return { success: false, error: "Vehicle Identity reikalauja UK valst. nr. (VRM). Ne UK automobiliams šis šaltinis nebus naudojamas." };
  }
  const url = new URL("/experian/vehicleidentity/v3", baseUrl);
  url.searchParams.set("vehicle_registration_mark", vrmVal);
  url.searchParams.set("vehicle_identification_number", vin);

  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    Accept: "application/json",
  };

  try {
    const res = await fetch(url.toString(), { method: "GET", headers });
    const body = await res.json().catch(() => ({}));
    if (res.status !== 200) {
      const msg = (body as { error?: string }).error || res.statusText || `HTTP ${res.status}`;
      return { success: false, error: `Vehicle Identity (${res.status}): ${msg}` };
    }
    if (!(body as { success?: boolean }).success && (body as { error?: string }).error) {
      return { success: false, error: (body as { error: string }).error };
    }
    return body;
  } catch (e) {
    const msg = (e as Error).message;
    return { success: false, error: msg.toLowerCase().includes("fetch") ? `Tinklas: ${msg}. Galimas CORS – bandyk per backend.` : msg };
  }
}

/** Cartell VIN Decoder – gamintojas, modelis, metai, kuras, pavarų dėžė ir kt. (synchronous GET) */
async function fetchCartellVindecoder(
  vin: string,
  apiKey: string,
  baseUrl: string
): Promise<{ success: boolean; result?: CartellVindecoderResult; error?: string }> {
  const url = new URL("/cartell/vindecoder/", baseUrl);
  url.searchParams.set("vehicle_identification_number", vin);
  const headers: Record<string, string> = { "x-api-key": apiKey, Accept: "application/json" };
  try {
    const res = await fetch(url.toString(), { method: "GET", headers });
    const body = await res.json().catch(() => ({}));
    if (res.status !== 200) {
      const msg = (body as { error?: string }).error || res.statusText || `HTTP ${res.status}`;
      return { success: false, error: `Cartell VIN Decoder (${res.status}): ${msg}` };
    }
    if (!(body as { success?: boolean }).success && (body as { error?: string }).error) {
      return { success: false, error: (body as { error: string }).error };
    }
    return body;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

interface CartellVindecoderResult {
  manufacturer_desc?: string;
  model_range_desc?: string;
  model_desc?: string;
  derivative_desc?: string;
  body_type_desc?: string;
  fuel_type_desc?: string;
  transmission_desc?: string;
  manufactured_year?: number;
}

function mapCartellVindecoderToReportFields(r: CartellVindecoderResult | undefined): Partial<CarReport> {
  if (!r) return {};
  const make = r.manufacturer_desc ?? "";
  const model = ([r.model_range_desc, r.model_desc, r.derivative_desc].filter(Boolean).join(" ") || r.derivative_desc) ?? "";
  return {
    make: make || "–",
    model: (model || "–").trim(),
    year: r.manufactured_year ?? 0,
    technicalSpecs: {
      ...(r.fuel_type_desc ? { fuelType: r.fuel_type_desc } : {}),
      ...(r.transmission_desc ? { transmission: r.transmission_desc } : {}),
      ...(r.body_type_desc ? { bodyType: r.body_type_desc } : {}),
    },
  };
}

/** Experian AutoCheck – finansai, vagystė, write-off (UK VRM būtinas). GET /experian/autocheck/v3 */
async function fetchAutoCheck(
  vrm: string,
  vin: string | undefined,
  apiKey: string,
  baseUrl: string
): Promise<{ success: boolean; result?: AutoCheckResult; error?: string }> {
  const url = new URL("/experian/autocheck/v3", baseUrl);
  url.searchParams.set("vehicle_registration_mark", vrm.trim());
  if (vin?.trim()) url.searchParams.set("vehicle_identification_number", vin.trim());
  const headers: Record<string, string> = { "x-api-key": apiKey, Accept: "application/json" };
  try {
    const res = await fetch(url.toString(), { method: "GET", headers });
    const body = await res.json().catch(() => ({}));
    if (res.status !== 200) {
      const msg = (body as { error?: string }).error || res.statusText || `HTTP ${res.status}`;
      return { success: false, error: `Experian AutoCheck (${res.status}): ${msg}` };
    }
    if (!(body as { success?: boolean }).success && (body as { error?: string }).error) {
      return { success: false, error: (body as { error: string }).error };
    }
    return body;
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

interface AutoCheckResult {
  vehicle_registration_mark?: string;
  vehicle_identification_number?: string;
  theft_indicator?: string;
  theft_indictor_literal?: string;
  stolen_vehicle_data_qty?: number;
  stolen_vehicle_data_items?: { is_stolen?: boolean }[];
  finance_data_qty?: number;
  finance_data_items?: unknown[];
  [key: string]: unknown;
}

function getTheftStatusFromAutoCheck(r: AutoCheckResult | undefined): CarReport["theftStatus"] {
  if (!r) return "clear";
  const lit = (r.theft_indictor_literal ?? r.theft_indicator ?? "").toUpperCase();
  if (lit === "STOLEN" || lit === "Y") return "flagged";
  const items = r.stolen_vehicle_data_items;
  if (Array.isArray(items) && items.some((i) => i?.is_stolen === true)) return "flagged";
  return "clear";
}

/** Vehicle Identity atsakymo laukai (pagal tavo sample ir Postman) */
interface VehicleIdentityResult {
  vehicle_identification_number?: string;
  vehicle_registration_mark?: string;
  does_vehicle_registration_mark_match?: boolean;
  does_vehicle_identification_number_match?: boolean;
  dvla_manufacturer_desc?: string;
  dvla_model_desc?: string;
  dvla_fuel_desc?: string;
  dvla_body_desc?: string;
  dvla_transmission_desc?: string;
  number_gears?: number;
  manufactured_year?: number;
  first_registration_date?: string;
  registration_date?: string;
  colour?: string;
  original_colour?: string;
  engine_capacity_cc?: number;
  engine_number?: string;
  max_netpower_kw?: number;
  co2_gkm?: number;
  number_seats?: number;
  is_scrapped?: boolean;
  scrapped_date?: string;
  is_exported?: boolean;
  is_imported?: boolean;
  imported_date?: string;
  used_before_first_registration?: boolean;
  vehicle_identity_check_qty?: number;
  vehicle_identity_check_items?: { date_of_vehicle_identity_check?: string; result_of_vehicle_identity_check?: string }[];
  [key: string]: unknown;
}

function mapVehicleIdentityToReportFields(r: VehicleIdentityResult | undefined): Partial<CarReport> {
  if (!r) return {};
  const year = r.manufactured_year ?? 0;
  const make = r.dvla_manufacturer_desc ?? "";
  const model = r.dvla_model_desc ?? "";
  const engineStr = [r.engine_capacity_cc ? `${r.engine_capacity_cc} cm³` : "", r.engine_number].filter(Boolean).join(" ") || "–";
  const powerStr = r.max_netpower_kw != null ? `${r.max_netpower_kw} kW` : "–";
  const fuelType = r.dvla_fuel_desc ?? "–";
  const technicalSpecs: Record<string, string> = {
    engine: engineStr,
    power: powerStr,
    fuelType,
    ...(r.dvla_transmission_desc ? { transmission: r.dvla_transmission_desc } : {}),
    ...(r.dvla_body_desc ? { bodyType: r.dvla_body_desc } : {}),
    ...(r.colour ? { colour: r.colour } : {}),
    ...(r.co2_gkm != null ? { co2: `${r.co2_gkm} g/km` } : {}),
  };
  return {
    make: make || "–",
    model: model || "–",
    year: year || 0,
    technicalSpecs,
  };
}

/** Tipai pagal Postman/OpenAPI */
interface EzyVinServiceEvent {
  date_of_service_event?: string;
  mileage_observed?: number;
  mileage_unit?: string;
  service_provider?: string;
  service_type?: string;
  service_actions?: unknown[];
}

interface EzyVinServiceHistoryResult {
  vehicle_identification_number?: string;
  service_events?: EzyVinServiceEvent[];
}

interface EzyVinLookupResult {
  vehicle_identification_number?: string;
  oem_vehicle_desc?: string;
  vehicle_desc?: string;
  manufacturer_desc?: string;
  oem_model_range_desc?: string;
  oem_derivative_desc?: string;
  oem_model_year?: number;
  manufactured_year?: number;
  oem_fuel_type_desc?: string;
  oem_engine_desc?: string;
  power_kw?: number;
  oem_transmission_type_desc?: string;
}

/** Pilni serviso įrašai ataskaitai – data, rida, vienetas, teikėjas, tipas, atlikti darbai */
function mapToServiceEventRecords(serviceEvents: EzyVinServiceEvent[] | undefined): ServiceEventRecord[] {
  if (!Array.isArray(serviceEvents) || serviceEvents.length === 0) return [];
  return serviceEvents
    .filter((e) => e?.date_of_service_event != null)
    .map((e) => ({
      date_of_service_event: String(e.date_of_service_event ?? ""),
      mileage_observed: Number(e.mileage_observed) ?? 0,
      mileage_unit: String(e.mileage_unit ?? "km"),
      service_provider: String(e.service_provider ?? ""),
      service_type: String(e.service_type ?? ""),
      service_actions: Array.isArray(e.service_actions)
        ? e.service_actions.map((a) => (typeof a === "string" ? a : String(a)))
        : [],
    }));
}

function mapServiceHistoryToMileageHistory(
  serviceEvents: EzyVinServiceEvent[] | undefined
): { date: string; value: number }[] {
  if (!Array.isArray(serviceEvents) || serviceEvents.length === 0) return [];

  const sorted = [...serviceEvents]
    .filter((e) => e?.date_of_service_event != null && e?.mileage_observed != null)
    .map((e) => {
      let value = Number(e.mileage_observed) || 0;
      const unit = (e.mileage_unit || "").toLowerCase();
      if (unit === "mi" || unit === "miles") value = Math.round(value * 1.60934);
      const date = (e.date_of_service_event || "").slice(0, 7);
      return { date: date || "?", value };
    })
    .filter((e) => e.date !== "?");

  sorted.sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map<string, number>();
  for (const e of sorted) byDate.set(e.date, e.value);
  return Array.from(byDate.entries()).map(([date, value]) => ({ date, value }));
}

function mapVinLookupToCarReportFields(result: EzyVinLookupResult | undefined): Partial<CarReport> {
  if (!result) return {};
  const year = result.oem_model_year ?? result.manufactured_year ?? 0;
  const make = result.manufacturer_desc ?? "";
  const modelRaw = [result.oem_model_range_desc, result.oem_derivative_desc, result.vehicle_desc].filter(Boolean).join(" ");
  const model = modelRaw || result.vehicle_desc || "";
  return {
    make: make || "–",
    model: (model || result.oem_vehicle_desc || "–").trim(),
    year: year || 0,
    technicalSpecs: {
      engine: result.oem_engine_desc ?? "–",
      power: result.power_kw != null ? `${result.power_kw} kW` : "–",
      fuelType: result.oem_fuel_type_desc ?? "–",
      ...(result.oem_transmission_type_desc ? { transmission: result.oem_transmission_type_desc } : {}),
    },
  };
}

/**
 * Gauna automobilio ataskaitą iš One Auto API.
 * Kviečiami tik 2 šaltiniai: EzyVIN Service History ir OE VIN Lookup (Europe).
 * Jei nėra ONE_AUTO_API_KEY arba abu kvietimai nepavyksta – grąžina null (tada App rodo mock).
 */
export async function fetchCarReportFromOneAuto(
  vin: string,
  options?: { useSandbox?: boolean; maxPollAttempts?: number; pollIntervalMs?: number; vrm?: string }
): Promise<CarReport | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    if (typeof console !== "undefined" && console.warn) console.warn("[One Auto API] ONE_AUTO_API_KEY nenustatytas – naudojama mock ataskaita.");
    return null;
  }

  const baseUrl = getBaseUrl(options?.useSandbox ? "sandbox" : "live");
  const pollOpts = { maxPollAttempts: options?.maxPollAttempts ?? 6, pollIntervalMs: options?.pollIntervalMs ?? 3000 };
  const skipServiceHistory = isServiceHistorySkipped();

  const serviceHistoryPromise = skipServiceHistory
    ? Promise.resolve({ success: false, error: "Service History išjungtas (ONE_AUTO_SKIP_SERVICE_HISTORY)." as string })
    : fetchServiceHistory(vin, apiKey, baseUrl, pollOpts);

  const [historyRes, lookupRes] = await Promise.all([
    serviceHistoryPromise,
    fetchVinLookup(vin, apiKey, baseUrl, pollOpts),
  ]);

  if (typeof console !== "undefined" && console.log) {
    console.log("[One Auto API] EzyVIN Service History:", historyRes.success ? "OK" : historyRes.error);
    console.log("[One Auto API] OE VIN Lookup (Europe):", lookupRes.success ? "OK" : lookupRes.error);
  }

  const rawEvents = historyRes.result?.service_events;
  const mileageHistory = mapServiceHistoryToMileageHistory(rawEvents);
  const serviceEvents = mapToServiceEventRecords(rawEvents);
  const fromLookup = mapVinLookupToCarReportFields(lookupRes.result);

  const report: CarReport = {
    vin,
    make: fromLookup.make ?? "–",
    model: fromLookup.model ?? "–",
    year: fromLookup.year ?? 0,
    mileageHistory: mileageHistory.length > 0 ? mileageHistory : [{ date: new Date().toISOString().slice(0, 7), value: 0 }],
    serviceEvents,
    damages: [],
    theftStatus: "unknown",
    technicalSpecs: fromLookup.technicalSpecs ?? { engine: "–", power: "–", fuelType: "–" },
    marketValue: { min: 0, max: 0, average: 0 },
    rawApiResponses: { serviceHistory: historyRes, vinLookup: lookupRes },
  };

  const anySuccess = historyRes.success || lookupRes.success;
  if (!anySuccess) {
    const err = historyRes.error || lookupRes.error;
    if (typeof console !== "undefined" && console.warn) console.warn("[One Auto API] Abu šaltiniai nepavyko:", err);
    if (err) throw new Error(err);
    return null;
  }

  return report;
}
