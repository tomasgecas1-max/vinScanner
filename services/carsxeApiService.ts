/**
 * CarsXE API – specs, history ir theft check.
 * Naudoja proxy – CarsXE blokuoja CORS.
 * @see https://api.carsxe.com/docs/v1/specifications
 * @see https://api.carsxe.com/docs/v1/history
 * @see https://api.carsxe.com/docs/v1/lien-theft
 */

import type { CarReport, DamageRecord, TitleBrandRecord, JunkSalvageRecord, InsuranceRecord, LienTheftEventRecord } from "../types";

const CARSXE_SPECS_URL = "/api/carsxe-specs";
const CARSXE_HISTORY_URL = "/api/carsxe-history";
const CARSXE_THEFT_URL = "/api/carsxe-theft";

export interface CarsXeSpecsResponse {
  success: boolean;
  attributes?: Record<string, string>;
  error?: string;
}

export interface CarsXeSpecsResult {
  success: boolean;
  result?: { attributes?: Record<string, string> };
  error?: string;
}

/**
 * Gauna automobilio specifikacijas pagal VIN (per proxy – serveris kreipiasi į CarsXE).
 */
export async function fetchVehicleSpecs(vin: string): Promise<CarsXeSpecsResult> {
  const url = new URL(CARSXE_SPECS_URL, window.location.origin);
  url.searchParams.set("vin", vin.trim());

  try {
    const res = await fetch(url.toString(), { method: "GET" });
    const data = (await res.json()) as CarsXeSpecsResponse;

    if (!res.ok) {
      return { success: false, error: data.error || res.statusText || `HTTP ${res.status}` };
    }

    if (!data.success || !data.attributes) {
      return { success: false, error: data.error || "Duomenų nėra." };
    }

    return { success: true, result: { attributes: data.attributes } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: msg };
  }
}

/**
 * Iš CarsXE attributes žemėlina make, model, year, technicalSpecs į CarReport laukus.
 */
export function mapVehicleSpecsToReportFields(attrs: Record<string, string> | undefined): Partial<CarReport> {
  if (!attrs || typeof attrs !== "object") return {};

  const yearNum = parseInt(attrs.year ?? attrs.model_year ?? "0", 10) || 0;
  const make = (attrs.make ?? attrs.manufacturer ?? "").trim() || "–";
  const model = [attrs.model, attrs.series, attrs.trim].filter(Boolean).join(" ").trim() || "–";

  const technicalSpecs: Record<string, string> = {};
  if (attrs.engine) technicalSpecs.engine = attrs.engine;
  if (attrs.engine_size) technicalSpecs.engineSize = attrs.engine_size;
  if (attrs.engine_cylinders) technicalSpecs.cylinders = attrs.engine_cylinders;
  if (attrs.fuel_type) technicalSpecs.fuelType = attrs.fuel_type;
  if (attrs.transmission ?? attrs.transmission_short) technicalSpecs.transmission = attrs.transmission || attrs.transmission_short || "";
  if (attrs.drivetrain) technicalSpecs.drivetrain = attrs.drivetrain;
  if (attrs.doors) technicalSpecs.doors = attrs.doors;
  if (attrs.standard_seating) technicalSpecs.seats = attrs.standard_seating;
  if (attrs.body_style ?? attrs.style ?? attrs.type) technicalSpecs.bodyStyle = attrs.body_style || attrs.style || attrs.type || "";
  if (attrs.curb_weight) technicalSpecs.curbWeight = attrs.curb_weight;
  if (attrs.made_in) technicalSpecs.madeIn = attrs.made_in;

  return {
    make,
    model,
    year: yearNum,
    technicalSpecs: Object.keys(technicalSpecs).length > 0 ? technicalSpecs : { engine: "–", power: "–", fuelType: "–" },
  };
}

// ---- CarsXE History ----

type OdometerRecord = {
  VehicleOdometerReadingMeasure?: string;
  VehicleOdometerReadingUnitCode?: string;
  TitleIssueDate?: { Date?: string };
};

/** NMVTIS / CarsXE title brand descriptions – naudojama kai API negrąžina description. Eksportuojama ReportView visiems galimiems punktams. */
export const TITLE_BRAND_DESCRIPTIONS: Record<string, { name: string; description: string }> = {
  "00": { name: "Clear", description: "No brand exists for the vehicle." },
  "01": { name: "Flood damage", description: "Vehicle damaged by freshwater flood (or it is unknown whether the damage was caused by fresh water or salt water)." },
  "02": { name: "Fire damage", description: "Vehicle damaged by fire." },
  "03": { name: "Hail damage", description: "Vehicle damaged by hail." },
  "04": { name: "Salt water damage", description: "Vehicle damaged by saltwater flood." },
  "05": { name: "Vandalism", description: "Vehicle damaged by vandals." },
  "06": { name: "Kit", description: "A Vehicle that has been built by combining a chassis with a different (non-matching VIN) frame engine and body parts." },
  "07": { name: "Dismantled", description: "The vehicle can only be sold as parts and cannot be legally driven." },
  "08": { name: "Junk", description: "The vehicle is incapable of safe operation for use on roads or highways and has no resale value except as a source of parts or scrap." },
  "09": { name: "Rebuilt", description: "The vehicle previously branded salvage has passed anti-theft and safety inspections. Also known as prior salvage (salvaged)." },
  "10": { name: "Reconstructed", description: "A vehicle that has been permanently altered from original construction by removing, adding or substituting major components." },
  "11": { name: "Salvage--Damage or Not Specified", description: "Any vehicle which has been wrecked, destroyed or damaged to the extent that repair cost exceeds a jurisdiction-defined percentage of retail value." },
  "12": { name: "Test Vehicle", description: "The vehicle is built and retained by the manufacturer for testing." },
  "13": { name: "Refurbished", description: "Any vehicle modified by the installation of a new cab and chassis for the existing coach which has been renovated." },
  "14": { name: "Collision", description: "Vehicle damaged by collision." },
  "16": { name: "Salvage Retention", description: "The vehicle is branded salvage and is kept by the owner." },
  "17": { name: "Prior Taxi", description: "Vehicle previously registered as a taxi." },
  "18": { name: "Prior Police", description: "Vehicle previously registered as a police vehicle." },
  "19": { name: "Original Taxi", description: "Vehicle is currently registered as a taxi." },
  "20": { name: "Original Police", description: "Vehicle is currently registered as a police vehicle." },
  "21": { name: "Remanufactured", description: "Vehicle was reconstructed by the manufacturer." },
  "24": { name: "Antique", description: "The vehicle is over 50 years old." },
  "25": { name: "Classic", description: "The vehicle is over 20 years old and adheres to other jurisdiction-specific criteria." },
  "26": { name: "Agricultural Vehicle", description: "The vehicle will primarily be operated on private roads for agricultural purposes." },
  "30": { name: "Replica", description: "A vehicle with a body built to resemble and be a reproduction of another vehicle of a given year and manufacturer." },
  "31": { name: "Totaled", description: "A vehicle that is declared a total loss by a jurisdiction or insurer." },
  "32": { name: "Owner Retained", description: "A vehicle that has been declared a total loss but the owner maintains possession and ownership." },
  "34": { name: "Memorandum Copy", description: "The title document is a facsimile title and not the active (original or duplicate) title document." },
  "36": { name: "Recovered Theft", description: "The vehicle was previously titled as salvage due to theft. The vehicle has been repaired and inspected and may be legally driven." },
  "40": { name: "Vehicle Non-conformity Corrected", description: "A non-safety defect reported by the manufacturer has been corrected." },
  "41": { name: "Vehicle Safety Defect Uncorrected", description: "A safety defect reported by the manufacturer remains uncorrected." },
  "42": { name: "Vehicle Safety Defect Corrected", description: "A safety defect reported by the manufacturer has been corrected." },
  "43": { name: "VIN replaced by new state assigned VIN", description: "A title should not be issued for the VIN. This brand can be issued for rebuilt vehicles." },
  "45": { name: "Gray Market", description: "Vehicle manufactured for use outside the US, brought into the US, not in compliance with federal standards." },
  "46": { name: "Gray Market", description: "Vehicle manufactured for use outside the US, brought into the US, in compliance with federal standards." },
  "48": { name: "Former Rental", description: "Former Rental" },
  "49": { name: "Salvage--Stolen", description: "Vehicle considered salvage because an insurance company acquired ownership pursuant to a settlement based on theft." },
  "51": { name: "Disclosed Damage", description: "The vehicle has sustained damage to the extent that the damage is required to be disclosed under the jurisdiction's damage disclosure law." },
  "52": { name: "Prior Non-Repairable", description: "A vehicle constructed by repairing a vehicle that has been destroyed or declared non-repairable." },
  "55": { name: "Hazardous substance", description: "The vehicle has been contaminated by a hazardous substance and is unsafe for use." },
  "56": { name: "Export Only Vehicle", description: "A salvage or junk vehicle determined for exportation outside of the United States, not eligible for re-title in the US." },
  "68": { name: "Actual", description: "The true mileage for the vehicle. The odometer has not been tampered with." },
  "69": { name: "Not Actual", description: "The odometer reading is known to be other than the true mileage for the vehicle." },
  "70": { name: "Not Actual", description: "Odometer tampering verified – the odometer reading is known to be other than the true mileage due to tampering." },
  "71": { name: "Exempt from Odometer Disclosure", description: "The vehicle falls within criteria that allow it to change ownership without disclosure of the odometer reading." },
  "72": { name: "Exceeds Mechanical Limits", description: "The odometer reading is less than the true mileage because the odometer cannot display the total number of true miles." },
  "74": { name: "Odometer Replaced", description: "The odometer in the vehicle is not the odometer put in the vehicle when manufactured." },
};

type JunkSalvageRaw = {
  ReportingEntityAbstract?: { EntityName?: string; LocationCityName?: string; LocationStateUSPostalServiceCode?: string };
  VehicleObtainedDate?: string;
  VehicleDispositionText?: string;
  VehicleIntendedForExportCode?: string;
};
type InsuranceRaw = {
  ReportingEntityAbstract?: { EntityName?: string; LocationCityName?: string; LocationStateUSPostalServiceCode?: string };
  VehicleObtainedDate?: string;
};

export interface CarsXeHistoryResponse {
  vin?: string;
  success?: boolean;
  error?: { code?: string; message?: string };
  vinChanged?: boolean;
  historyInformation?: OdometerRecord[];
  currentTitleInformation?: Array<OdometerRecord & { HistoricTitleAbstract?: OdometerRecord[] }>;
  brandsInformation?: Array<{
    code?: string;
    name?: string;
    description?: string;
    record?: unknown;
  }>;
  junkAndSalvageInformation?: JunkSalvageRaw[];
  insuranceInformation?: InsuranceRaw[];
}

export interface CarsXeHistoryResult {
  success: boolean;
  result?: CarsXeHistoryResponse;
  error?: string;
}

export async function fetchVehicleHistory(vin: string): Promise<CarsXeHistoryResult> {
  const url = new URL(CARSXE_HISTORY_URL, window.location.origin);
  url.searchParams.set("vin", vin.trim());
  try {
    const res = await fetch(url.toString(), { method: "GET" });
    const data = (await res.json()) as CarsXeHistoryResponse & { error?: string };
    if (!res.ok) return { success: false, error: data.error || res.statusText || `HTTP ${res.status}` };
    if (data.error?.code === "report_not_found" || !data.success) {
      return { success: false, result: data, error: "Vehicle history not found for this VIN" };
    }
    return { success: true, result: data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: msg };
  }
}

function extractOdometerPoint(x: OdometerRecord): { date: string; value: number } | null {
  if (!x.VehicleOdometerReadingMeasure || !x.TitleIssueDate?.Date) return null;
  const miles = parseInt(String(x.VehicleOdometerReadingMeasure).replace(/\D/g, ""), 10) || 0;
  const km = Math.round(miles * 1.60934);
  const dateStr = x.TitleIssueDate.Date.slice(0, 7);
  return { date: dateStr, value: km };
}

/** Žemėlina CarsXE History į CarReport laukus: mileageHistory, damages, theftStatus */
export function mapCarsXeHistoryToReportFields(h: CarsXeHistoryResponse | undefined): Partial<CarReport> {
  if (!h) return {};

  const points: { date: string; value: number }[] = [];

  const addRecord = (r: OdometerRecord) => {
    const p = extractOdometerPoint(r);
    if (p && p.value >= 0) points.push(p);
  };

  if (Array.isArray(h.historyInformation)) {
    h.historyInformation.forEach(addRecord);
  }
  if (Array.isArray(h.currentTitleInformation)) {
    for (const curr of h.currentTitleInformation) {
      addRecord(curr);
      if (Array.isArray(curr.HistoricTitleAbstract)) {
        curr.HistoricTitleAbstract.forEach(addRecord);
      }
    }
  }

  const mileageHistory: { date: string; value: number }[] = [];
  if (points.length > 0) {
    const byDate = new Map<string, number>();
    for (const p of points) {
      const existing = byDate.get(p.date);
      if (existing == null || p.value > existing) byDate.set(p.date, p.value);
    }
    const sorted = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    for (const [date, value] of sorted) mileageHistory.push({ date, value });
  }

  const damages: DamageRecord[] = [];
  const titleBrands: TitleBrandRecord[] = [];
  const brands = h.brandsInformation;
  if (Array.isArray(brands)) {
    const severityMap: Record<string, "high" | "medium"> = {
      "08": "high", "11": "high", "49": "high", "31": "high", "36": "high",
      "01": "high", "02": "high", "04": "high", "14": "high", "51": "medium",
    };
    for (const b of brands) {
      if (!b.record) continue;
      const rec = b.record as { VehicleBrandDate?: { Date?: string }; ReportingEntityAbstract?: { EntityName?: string } };
      const code = String(b.code ?? "").padStart(2, "0");
      const name = b.name ?? TITLE_BRAND_DESCRIPTIONS[code]?.name ?? `Brand ${code}`;
      const description = b.description ?? TITLE_BRAND_DESCRIPTIONS[code]?.description;
      const date = rec.VehicleBrandDate?.Date?.slice(0, 10);
      const reportingEntity = rec.ReportingEntityAbstract?.EntityName;
      titleBrands.push({
        code,
        name,
        ...(description ? { description } : {}),
        ...(date ? { date } : {}),
        ...(reportingEntity ? { reportingEntity } : {}),
      });
      if (b.code && b.name) {
        const rec = b.record as { VehicleBrandDate?: { Date?: string } };
        const date = rec.VehicleBrandDate?.Date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
        damages.push({
          date,
          description: b.name,
          estimatedCost: 0,
          severity: severityMap[b.code] ?? "medium",
        });
      }
    }
  }

  let theftStatus: CarReport["theftStatus"] = "unknown";
  if (Array.isArray(brands)) {
    const theftCodes = ["49", "36"];
    if (brands.some((b) => b.record && b.code && theftCodes.includes(b.code))) theftStatus = "flagged";
  }

  const junkSalvageRecords: JunkSalvageRecord[] = [];
  if (Array.isArray(h.junkAndSalvageInformation)) {
    for (const j of h.junkAndSalvageInformation) {
      const abs = j.ReportingEntityAbstract;
      const date = j.VehicleObtainedDate ? String(j.VehicleObtainedDate).slice(0, 10) : undefined;
      const loc = [abs?.LocationCityName, abs?.LocationStateUSPostalServiceCode].filter(Boolean).join(", ");
      junkSalvageRecords.push({
        entityName: abs?.EntityName,
        location: loc || undefined,
        obtainedDate: date,
        disposition: j.VehicleDispositionText,
        intendedForExport: j.VehicleIntendedForExportCode,
      });
    }
  }

  const insuranceRecords: InsuranceRecord[] = [];
  if (Array.isArray(h.insuranceInformation)) {
    for (const i of h.insuranceInformation) {
      const abs = i.ReportingEntityAbstract;
      const date = i.VehicleObtainedDate ? String(i.VehicleObtainedDate).slice(0, 10) : undefined;
      const loc = [abs?.LocationCityName, abs?.LocationStateUSPostalServiceCode].filter(Boolean).join(", ");
      insuranceRecords.push({
        entityName: abs?.EntityName,
        location: loc || undefined,
        obtainedDate: date,
      });
    }
  }

  const out: Partial<CarReport> = {};
  if (mileageHistory.length > 0) out.mileageHistory = mileageHistory;
  if (damages.length > 0) out.damages = damages;
  if (titleBrands.length > 0) out.titleBrands = titleBrands;
  if (junkSalvageRecords.length > 0) out.junkSalvageRecords = junkSalvageRecords;
  if (insuranceRecords.length > 0) out.insuranceRecords = insuranceRecords;
  if (h.vinChanged === true) out.vinChanged = true;
  if (theftStatus !== "unknown") out.theftStatus = theftStatus;
  return out;
}

// ---- CarsXE Lien & Theft Check ----
// Dokumentacija: https://api.carsxe.com/docs/v1/lien-theft
// v1 API grąžina events masyvą; senesnė versija – lienRecords/theftRecords

export interface CarsXeTheftResponse {
  success?: boolean;
  vin?: string;
  input?: { vin?: string };
  /** v1 API – events masyvas */
  events?: Array<{
    event?: string;
    location?: string;
    date?: string;
    lienholder?: string;
    details_list?: string[];
  }>;
  /** Senesnė versija */
  lienRecords?: Array<{
    lienDate?: string;
    lienHolder?: string;
    lienType?: string;
  }>;
  theftRecords?: Array<{
    theftDate?: string;
    theftType?: string;
    reportingAgency?: string;
    status?: string;
  }>;
  error?: { code?: string; message?: string } | string;
}

export interface CarsXeTheftResult {
  success: boolean;
  result?: CarsXeTheftResponse;
  error?: string;
}

/**
 * Patikrina ar automobilis yra vagysčių/įkeitimo registre pagal VIN.
 */
export async function fetchTheftCheck(vin: string): Promise<CarsXeTheftResult> {
  const url = new URL(CARSXE_THEFT_URL, window.location.origin);
  url.searchParams.set("vin", vin.trim());
  try {
    const res = await fetch(url.toString(), { method: "GET" });
    const data = (await res.json()) as CarsXeTheftResponse & { error?: string };
    if (!res.ok) {
      return { success: false, error: typeof data.error === 'string' ? data.error : res.statusText || `HTTP ${res.status}` };
    }
    if (data.error && typeof data.error === 'object' && data.error.code) {
      return { success: false, result: data, error: data.error.message || "Theft check failed" };
    }
    return { success: true, result: data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: msg };
  }
}

/**
 * Žemėlina CarsXE Lien & Theft Check į CarReport theftStatus ir lienTheftEvents.
 * Palaiko v1 API (events) ir seną formatą (lienRecords, theftRecords).
 */
export function mapTheftCheckToReportFields(data: CarsXeTheftResponse | undefined): Partial<CarReport> {
  if (!data) return {};

  const lienTheftEvents: LienTheftEventRecord[] = [];
  let theftStatus: CarReport["theftStatus"] = "clear";
  let hasAnyRecords = false;

  if (Array.isArray(data.events) && data.events.length > 0) {
    hasAnyRecords = true;
    for (const e of data.events) {
      const ev = (e.event ?? "").toLowerCase();
      const isRecovered = ev.includes("recovered");
      if (ev.includes("active theft") || ev.includes("theft")) theftStatus = isRecovered ? theftStatus : "flagged";
      const desc = e.details_list?.[0] ?? e.event ?? "";
      lienTheftEvents.push({
        type: ev.replace(/\s+/g, "_").slice(0, 30) || "event",
        description: desc,
        location: e.location,
        date: e.date,
        lienHolder: e.lienholder,
      });
    }
  }

  if (Array.isArray(data.theftRecords) && data.theftRecords.length > 0) {
    hasAnyRecords = true;
    const activeTheft = data.theftRecords.some((r) => (r.status ?? "").toLowerCase() !== "recovered");
    if (activeTheft) theftStatus = "flagged";
    for (const r of data.theftRecords) {
      const st = (r.status ?? "").toLowerCase();
      lienTheftEvents.push({
        type: st === "recovered" ? "recovered_theft" : "theft",
        description: r.theftType ?? r.reportingAgency ?? r.status ?? "Theft record",
        date: r.theftDate,
        location: r.reportingAgency,
      });
    }
  }

  if (Array.isArray(data.lienRecords) && data.lienRecords.length > 0) {
    hasAnyRecords = true;
    for (const r of data.lienRecords) {
      lienTheftEvents.push({
        type: "lien",
        description: r.lienType ?? `Lien: ${r.lienHolder ?? "Unknown"}`,
        date: r.lienDate,
        lienHolder: r.lienHolder,
      });
    }
  }

  return {
    theftStatus,
    ...(lienTheftEvents.length > 0 ? { lienTheftEvents } : {}),
  };
}

/** Gauna history duomenis – palaiko { success, result } ir tiesioginį raw API atsakymą */
function getCarsXeHistoryData(obj: unknown): CarsXeHistoryResponse | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const o = obj as Record<string, unknown>;
  if (o.success !== true) return undefined;
  // formatas: { success, result: { vinChanged, junkAndSalvageInformation, ... } }
  if (o.result && typeof o.result === 'object') return o.result as CarsXeHistoryResponse;
  // formatas: { success, vinChanged, junkAndSalvageInformation, ... } – raw API atsakymas tiesiogiai
  if ('vinChanged' in o || 'junkAndSalvageInformation' in o || 'insuranceInformation' in o) return o as CarsXeHistoryResponse;
  return undefined;
}

/** Gauna theft duomenis – palaiko { success, result } ir tiesioginį raw atsakymą */
function getCarsXeTheftData(obj: unknown): CarsXeTheftResponse | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const o = obj as Record<string, unknown>;
  if (o.success !== true) return undefined;
  if (o.result && typeof o.result === 'object') return o.result as CarsXeTheftResponse;
  if ('events' in o || 'lienRecords' in o || 'theftRecords' in o) return o as CarsXeTheftResponse;
  return undefined;
}

/**
 * Iš raw API atsakymų papildo ataskaitą CarsXE laukais (junkSalvageRecords, insuranceRecords, vinChanged, lienTheftEvents, titleBrands),
 * jei jie dar nėra ištraukti – padeda rodyti šias sekcijas ir senesnėse išsaugotose ataskaitose.
 */
export function enrichReportFromRawCarsXe(report: CarReport): CarReport {
  if (!report.rawApiResponses || typeof report.rawApiResponses !== 'object') return report;
  const raw = report.rawApiResponses as Record<string, unknown>;
  let changed = false;
  const out = { ...report };

  const historyData = getCarsXeHistoryData(raw.carsxeHistory);
  if (historyData) {
    const fromH = mapCarsXeHistoryToReportFields(historyData);
    if (fromH.junkSalvageRecords?.length && !out.junkSalvageRecords?.length) {
      out.junkSalvageRecords = fromH.junkSalvageRecords;
      changed = true;
    }
    if (fromH.insuranceRecords?.length && !out.insuranceRecords?.length) {
      out.insuranceRecords = fromH.insuranceRecords;
      changed = true;
    }
    if (fromH.vinChanged === true && out.vinChanged !== true) {
      out.vinChanged = true;
      changed = true;
    }
    if (fromH.titleBrands?.length && !out.titleBrands?.length) {
      out.titleBrands = fromH.titleBrands;
      changed = true;
    }
  }

  const theftData = getCarsXeTheftData(raw.carsxeTheft);
  if (theftData) {
    const fromT = mapTheftCheckToReportFields(theftData);
    if (fromT.lienTheftEvents?.length && !out.lienTheftEvents?.length) {
      out.lienTheftEvents = fromT.lienTheftEvents;
      changed = true;
    }
  }

  return changed ? out : report;
}
