/**
 * CarsXE API – specs ir history.
 * Naudoja proxy – CarsXE blokuoja CORS.
 * @see https://api.carsxe.com/docs/v1/specifications
 * @see https://api.carsxe.com/docs/v1/history
 */

import type { CarReport, DamageRecord } from "../types";

const CARSXE_SPECS_URL = "/api/carsxe-specs";
const CARSXE_HISTORY_URL = "/api/carsxe-history";

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

export interface CarsXeHistoryResponse {
  vin?: string;
  success?: boolean;
  error?: { code?: string; message?: string };
  historyInformation?: Array<{
    VehicleOdometerReadingMeasure?: string;
    VehicleOdometerReadingUnitCode?: string;
    TitleIssueDate?: { Date?: string };
  }>;
  brandsInformation?: Array<{
    code?: string;
    name?: string;
    description?: string;
    record?: unknown;
  }>;
  junkAndSalvageInformation?: unknown[];
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

/** Žemėlina CarsXE History į CarReport laukus: mileageHistory, damages, theftStatus */
export function mapCarsXeHistoryToReportFields(h: CarsXeHistoryResponse | undefined): Partial<CarReport> {
  if (!h) return {};

  const mileageHistory: { date: string; value: number }[] = [];
  const historyInfo = h.historyInformation;
  if (Array.isArray(historyInfo) && historyInfo.length > 0) {
    const MILES_TO_KM = 1.60934;
    const points = historyInfo
      .filter((x) => x.VehicleOdometerReadingMeasure != null && x.TitleIssueDate?.Date)
      .map((x) => {
        const miles = parseInt(String(x.VehicleOdometerReadingMeasure).replace(/\D/g, ""), 10) || 0;
        const km = Math.round(miles * MILES_TO_KM);
        const dateStr = x.TitleIssueDate?.Date?.slice(0, 7) ?? new Date().toISOString().slice(0, 7);
        return { date: dateStr, value: km };
      })
      .filter((p) => p.value >= 0);
    const byDate = new Map<string, number>();
    for (const p of points) {
      const existing = byDate.get(p.date);
      if (existing == null || p.value > existing) byDate.set(p.date, p.value);
    }
    const sorted = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    for (const [date, value] of sorted) mileageHistory.push({ date, value });
  }

  const damages: DamageRecord[] = [];
  const brands = h.brandsInformation;
  if (Array.isArray(brands)) {
    const severityMap: Record<string, "high" | "medium"> = {
      "08": "high", "11": "high", "49": "high", "31": "high", "36": "high",
      "01": "high", "02": "high", "04": "high", "14": "high", "51": "medium",
    };
    for (const b of brands) {
      if (!b.record || !b.code || !b.name) continue;
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

  let theftStatus: CarReport["theftStatus"] = "unknown";
  if (Array.isArray(brands)) {
    const theftCodes = ["49", "36"];
    if (brands.some((b) => b.record && b.code && theftCodes.includes(b.code))) theftStatus = "flagged";
  }

  const out: Partial<CarReport> = {};
  if (mileageHistory.length > 0) out.mileageHistory = mileageHistory;
  if (damages.length > 0) out.damages = damages;
  if (theftStatus !== "unknown") out.theftStatus = theftStatus;
  return out;
}
