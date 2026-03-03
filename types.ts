/** Vienas serviso įrašas iš API (EzyVIN service_events) */
export interface ServiceEventRecord {
  date_of_service_event: string;
  mileage_observed: number;
  mileage_unit: string;
  service_provider: string;
  service_type: string;
  service_actions: string[];
}

/** CarsXE / NMVTIS title brand (pavadinimas ant titulo) */
export interface TitleBrandRecord {
  code: string;
  name: string;
  description?: string;
  date?: string;
  /** Reporting jurisdiction (e.g. NORTH CAROLINA, WISCONSIN) */
  reportingEntity?: string;
}

/** CarsXE junkAndSalvageInformation įrašas */
export interface JunkSalvageRecord {
  entityName?: string;
  location?: string;
  obtainedDate?: string;
  disposition?: string;
  intendedForExport?: string;
}

/** CarsXE insuranceInformation įrašas */
export interface InsuranceRecord {
  entityName?: string;
  location?: string;
  obtainedDate?: string;
}

/** CarsXE Lien & Theft event (events masyvas arba lienRecords/theftRecords) */
export interface LienTheftEventRecord {
  type: 'lien' | 'theft' | 'recovered_theft' | 'exported' | 'towing' | 'for_sale' | string;
  description: string;
  date?: string;
  location?: string;
  lienHolder?: string;
}

export interface CarReport {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileageHistory: { date: string; value: number }[];
  /** Pilna serviso istorija – data, rida, serviso teikėjas, tipas, atlikti darbai */
  serviceEvents: ServiceEventRecord[];
  damages: DamageRecord[];
  /** CarsXE brandsInformation – pavadinimai ant titulo (code, name, description) */
  titleBrands?: TitleBrandRecord[];
  /** CarsXE junkAndSalvageInformation – laužyno/salvage įrašai */
  junkSalvageRecords?: JunkSalvageRecord[];
  /** CarsXE insuranceInformation – draudimo įrašai */
  insuranceRecords?: InsuranceRecord[];
  /** CarsXE vinChanged – ar VIN buvo keistas */
  vinChanged?: boolean;
  /** CarsXE Lien & Theft – įkeitimų/vagysčių įvykiai */
  lienTheftEvents?: LienTheftEventRecord[];
  /** clear = patikrinta, ne vogtas; flagged = vogtas/ieškomas; unknown = patikra neatlikta */
  theftStatus: 'clear' | 'flagged' | 'unknown';
  technicalSpecs: Record<string, string>;
  marketValue: { min: number; max: number; average: number };
  /** Laikinai: pilni API atsakymai (atvaizdavimui / išsaugojimui) */
  rawApiResponses?: unknown;
}

export interface DamageRecord {
  date: string;
  description: string;
  estimatedCost: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/** AI (Gemini) ataskaitos analizė: problemos ir stiprybės */
export interface ReportAnalysis {
  problemAreas: string[];
  strongPoints: string[];
}
