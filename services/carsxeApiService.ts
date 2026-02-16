/**
 * Automobilio specifikacijų API (CarsXE specs).
 * Pavadinimas UI: "Automobilio specifikacijos" (ne CarsXE).
 * Naudoja proxy (/api/carsxe-specs) – CarsXE blokuoja CORS, todėl kvietimas eina per serverį.
 */

import type { CarReport } from "../types";

const CARSXE_PROXY_URL = "/api/carsxe-specs";

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
  const url = new URL(CARSXE_PROXY_URL, window.location.origin);
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
