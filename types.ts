/** Vienas serviso įrašas iš API (EzyVIN service_events) */
export interface ServiceEventRecord {
  date_of_service_event: string;
  mileage_observed: number;
  mileage_unit: string;
  service_provider: string;
  service_type: string;
  service_actions: string[];
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
  /** clear = patikrinta, ne vogtas; flagged = vogtas/ieškomas; unknown = patikra neatlikta (pvz. be UK valst. nr.) */
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
