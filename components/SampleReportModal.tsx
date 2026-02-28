import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Translations, LangCode } from '../constants/translations';

interface SampleReportModalProps {
  open: boolean;
  onClose: () => void;
  t: Translations;
  lang: LangCode;
}

const SAMPLE_VIN = 'WBA8E1100XK477XXX';
const SAMPLE_ORDER_ID = 'VS-XXXXXX-XXXX';

const MILEAGE_HISTORY = [
  { date: '2016-08-15', value: 3563 },
  { date: '2016-12-08', value: 15921 },
  { date: '2017-03-30', value: 29828 },
  { date: '2017-05-09', value: 33204 },
  { date: '2017-12-23', value: 53081 },
  { date: '2018-03-19', value: 57952 },
  { date: '2018-07-10', value: 64229 },
  { date: '2018-08-23', value: 65781 },
  { date: '2018-08-29', value: 66092 },
  { date: '2018-12-22', value: 74019 },
  { date: '2019-01-03', value: 74205 },
  { date: '2019-04-02', value: 79498 },
  { date: '2019-04-19', value: 80772 },
  { date: '2020-01-09', value: 96802 },
  { date: '2020-02-10', value: 99074 },
  { date: '2020-04-20', value: 100837 },
  { date: '2020-06-02', value: 101379 },
  { date: '2020-09-03', value: 101944 },
  { date: '2021-04-01', value: 115172 },
  { date: '2021-05-04', value: 118007 },
  { date: '2021-10-10', value: 130176 },
  { date: '2021-10-22', value: 131468 },
  { date: '2022-09-01', value: 155889 },
  { date: '2023-04-17', value: 169389 },
  { date: '2023-04-27', value: 170843 },
  { date: '2023-04-28', value: 170975 },
  { date: '2023-10-13', value: 181495 },
  { date: '2023-10-20', value: 182752 },
  { date: '2023-10-23', value: 183045 },
  { date: '2024-09-23', value: 200179 },
  { date: '2024-10-24', value: 200220 },
  { date: '2024-12-06', value: 201986 },
];

const SERVICE_PROVIDERS: Record<string, Record<string, string>> = {
  pl: {
    lt: 'Oficialus BMW Servisas, Lenkija',
    en: 'Official BMW Service, Poland',
    de: 'Offizieller BMW Service, Polen',
  },
  nl: {
    lt: 'Oficialus BMW Dileris, Olandija',
    en: 'Official BMW Dealer, Netherlands',
    de: 'Offizieller BMW Händler, Niederlande',
  },
  nl2: {
    lt: 'BMW Dileris, Olandija',
    en: 'BMW Dealer, Netherlands',
    de: 'BMW Händler, Niederlande',
  },
};

const SERVICE_ACTIONS: Record<string, Record<string, string>> = {
  'Engine oil.': {
    lt: 'Variklio alyva.',
    en: 'Engine oil.',
    de: 'Motoröl.',
  },
  'Brake fluid service.': {
    lt: 'Stabdžių skysčio keitimas.',
    en: 'Brake fluid service.',
    de: 'Bremsflüssigkeitswechsel.',
  },
  'Microfilter (consider further additional job(s) if appropriate).': {
    lt: 'Salono filtras (jei reikia, atlikti papildomus darbus).',
    en: 'Microfilter (consider further additional job(s) if appropriate).',
    de: 'Innenraumfilter (ggf. weitere Arbeiten durchführen).',
  },
  'Air filter element.': {
    lt: 'Oro filtro elementas.',
    en: 'Air filter element.',
    de: 'Luftfilterelement.',
  },
  'Vehicle check.': {
    lt: 'Automobilio patikra.',
    en: 'Vehicle check.',
    de: 'Fahrzeugprüfung.',
  },
  'unknown.': {
    lt: 'Nežinoma.',
    en: 'Unknown.',
    de: 'Unbekannt.',
  },
  'Statutory vehicle inspection.': {
    lt: 'Privaloma techninė apžiūra.',
    en: 'Statutory vehicle inspection.',
    de: 'Hauptuntersuchung.',
  },
};

const SERVICE_EVENTS = [
  { date: '2024-12-06', mileage: 201986, providerKey: null, type: 'service', actionKeys: [] },
  { date: '2024-10-24', mileage: 200220, providerKey: null, type: 'service', actionKeys: [] },
  { date: '2023-04-28', mileage: 170975, providerKey: 'pl', type: 'service', actionKeys: ['Engine oil.', 'Brake fluid service.', 'Microfilter (consider further additional job(s) if appropriate).'] },
  { date: '2021-10-22', mileage: 131468, providerKey: 'pl', type: 'service', actionKeys: ['Engine oil.', 'Air filter element.', 'Vehicle check.', 'Microfilter (consider further additional job(s) if appropriate).', 'unknown.'] },
  { date: '2021-05-04', mileage: 118007, providerKey: 'pl', type: 'service', actionKeys: ['Brake fluid service.'] },
  { date: '2020-09-03', mileage: 101944, providerKey: 'nl2', type: 'service', actionKeys: ['Statutory vehicle inspection.'] },
  { date: '2020-02-10', mileage: 99074, providerKey: 'nl', type: 'service', actionKeys: ['Engine oil.', 'Microfilter (consider further additional job(s) if appropriate).'] },
  { date: '2019-04-19', mileage: 80772, providerKey: 'nl', type: 'service', actionKeys: ['Brake fluid service.'] },
  { date: '2018-08-23', mileage: 65781, providerKey: 'nl', type: 'service', actionKeys: ['Engine oil.', 'Air filter element.', 'Vehicle check.', 'Microfilter (consider further additional job(s) if appropriate).', 'unknown.'] },
  { date: '2017-05-09', mileage: 33204, providerKey: 'nl', type: 'service', actionKeys: ['Engine oil.', 'Microfilter (consider further additional job(s) if appropriate).'] },
];

const TECHNICAL_SPECS: Record<string, string> = {
  oem_vehicle_desc: 'BMW 3 (F30, F80) 330 e',
  vehicle_desc: 'BMW 3 330 e',
  manufacturer_desc: 'BMW',
  oem_model_range_desc: '3 (F30, F80)',
  oem_derivative_desc: '330 e',
  manufactured_year: '2016',
  power_kw: '185',
  power_bhp: '252',
  oem_engine_desc: 'B48 B20 A',
  oem_fuel_type_desc: 'Petrol',
  oem_transmission_type_desc: 'automatic',
  oem_drivetrain_desc: 'Rear-Wheel Drive',
  oem_body_type_desc: 'Saloon',
  oem_colour_desc: 'black-sapphire metallic (475)',
  oem_interior_trim_desc: 'Leather Dakota sattelbraun/accent brown (PLCDJ)',
};

const FIELD_LABELS: Record<string, Record<string, string>> = {
  oem_vehicle_desc: { lt: 'OE aprašymas', en: 'OE description', de: 'OE Beschreibung' },
  vehicle_desc: { lt: 'Aprašymas', en: 'Description', de: 'Beschreibung' },
  manufacturer_desc: { lt: 'Gamintojas', en: 'Manufacturer', de: 'Hersteller' },
  oem_model_range_desc: { lt: 'Serija / modelis', en: 'Series / Model', de: 'Serie / Modell' },
  oem_derivative_desc: { lt: 'Derivatyvas', en: 'Derivative', de: 'Derivat' },
  manufactured_year: { lt: 'Gamybos metai', en: 'Year of manufacture', de: 'Baujahr' },
  power_kw: { lt: 'Galia (kW)', en: 'Power (kW)', de: 'Leistung (kW)' },
  power_bhp: { lt: 'Galia (AG)', en: 'Power (HP)', de: 'Leistung (PS)' },
  oem_engine_desc: { lt: 'Variklis', en: 'Engine', de: 'Motor' },
  oem_fuel_type_desc: { lt: 'Kuras', en: 'Fuel type', de: 'Kraftstoff' },
  oem_transmission_type_desc: { lt: 'Pavarų dėžė', en: 'Transmission', de: 'Getriebe' },
  oem_drivetrain_desc: { lt: 'Pavara', en: 'Drivetrain', de: 'Antrieb' },
  oem_body_type_desc: { lt: 'Kėbulo tipas', en: 'Body type', de: 'Karosserietyp' },
  oem_colour_desc: { lt: 'Spalva', en: 'Colour', de: 'Farbe' },
  oem_interior_trim_desc: { lt: 'Interjero apdaila', en: 'Interior trim', de: 'Innenausstattung' },
};

const MARKET_VALUE = { min: 9500, average: 12500, max: 15500 };

const AI_ANALYSIS: Record<string, { problemAreas: string[]; strongPoints: string[] }> = {
  lt: {
    problemAreas: [
      'Didelė rida (201 986 km) – gali reikėti papildomų patikrinimų',
      'Paskutiniai serviso įrašai be detalių apie atliktus darbus',
    ],
    strongPoints: [
      'Reguliariai prižiūrėtas oficialiuose BMW servisuose',
      'Nuosekli ridos istorija be manipuliacijų požymių',
      'Pilna serviso istorija nuo pirmos dienos',
      'Stabdžių skysčio keitimas atliktas reguliariai',
    ],
  },
  en: {
    problemAreas: [
      'High mileage (201,986 km) – may require additional checks',
      'Recent service records without details about work performed',
    ],
    strongPoints: [
      'Regularly maintained at official BMW service centers',
      'Consistent mileage history with no signs of tampering',
      'Complete service history from day one',
      'Brake fluid changed regularly',
    ],
  },
  de: {
    problemAreas: [
      'Hohe Laufleistung (201.986 km) – zusätzliche Prüfungen können erforderlich sein',
      'Letzte Serviceeinträge ohne Details zu durchgeführten Arbeiten',
    ],
    strongPoints: [
      'Regelmäßig bei offiziellen BMW-Servicezentren gewartet',
      'Konsistente Kilometerhistorie ohne Manipulationsanzeichen',
      'Vollständige Servicehistorie ab dem ersten Tag',
      'Bremsflüssigkeit regelmäßig gewechselt',
    ],
  },
};

const ORDER_LABEL: Record<string, string> = {
  lt: 'Užsakymo Nr.',
  en: 'Order No.',
  de: 'Bestell-Nr.',
};

const NO_DAMAGES: Record<string, string> = {
  lt: 'Žalų įrašų nerasta',
  en: 'No damage records found',
  de: 'Keine Schadenseinträge gefunden',
};

const MILEAGE_LABEL: Record<string, string> = {
  lt: 'Rida',
  en: 'Mileage',
  de: 'Kilometerstand',
};

function getLangGroup(lang: LangCode): 'lt' | 'en' | 'de' {
  if (lang === 'lt') return 'lt';
  if (lang === 'de' || lang === 'lb') return 'de';
  return 'en';
}

const SampleReportModal: React.FC<SampleReportModalProps> = ({ open, onClose, t, lang }) => {
  const [showOriginalServiceTexts, setShowOriginalServiceTexts] = useState(false);

  if (!open) return null;

  const langGroup = getLangGroup(lang);
  const chartData = MILEAGE_HISTORY.filter((_, i) => i % 4 === 0 || i === MILEAGE_HISTORY.length - 1);

  const getServiceProvider = (key: string | null) => {
    if (!key) return null;
    return showOriginalServiceTexts 
      ? SERVICE_PROVIDERS[key]?.en 
      : (SERVICE_PROVIDERS[key]?.[langGroup] || SERVICE_PROVIDERS[key]?.en);
  };

  const getServiceAction = (actionKey: string) => {
    return showOriginalServiceTexts 
      ? actionKey 
      : (SERVICE_ACTIONS[actionKey]?.[langGroup] || actionKey);
  };

  const getFieldLabel = (key: string) => {
    return FIELD_LABELS[key]?.[langGroup] || FIELD_LABELS[key]?.en || key.replace(/_/g, ' ');
  };

  const analysis = AI_ANALYSIS[langGroup] || AI_ANALYSIS.en;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ataskaitos antraštė */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
          <div className="w-full md:w-auto">
            <div className="text-indigo-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{t.report.fullReport}</div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight">2016 BMW 3 330 e</h2>
            <div className="flex items-center gap-2 mt-2 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span className="font-mono text-sm break-all">{SAMPLE_VIN}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 opacity-70">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span className="font-mono text-sm">{ORDER_LABEL[langGroup] || ORDER_LABEL.en} {SAMPLE_ORDER_ID}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full md:w-auto">
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400" />
              {t.report.theftClear}
            </div>
            <button
              type="button"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title={t.report.downloadPdf}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-auto md:ml-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Techniniai duomenys */}
          <div className="w-full px-6 sm:px-8 py-6 sm:py-8 border-b border-slate-100">
            <h4 className="text-slate-900 font-bold text-sm sm:text-base mb-4">{t.report.technicalSpecs}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {Object.entries(TECHNICAL_SPECS).map(([key, val]) => (
                <div key={key} className="flex justify-between py-3 border-b border-slate-200/50">
                  <span className="text-slate-500 text-xs sm:text-sm capitalize">{getFieldLabel(key)}</span>
                  <span className="text-slate-900 text-xs sm:text-sm font-semibold text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 p-0 lg:p-8">
            {/* Ridos ir serviso istorija */}
            <div className="lg:col-span-2 space-y-10 p-6 sm:p-8 lg:p-0">
              {/* Ridos sekcija */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-2-2"/></svg>
                    {t.report.mileageHistory}
                  </h3>
                  <span className="text-xs sm:text-sm text-slate-500 font-medium">{t.report.lastMileage} 201 986 km</span>
                </div>
                <div className="h-48 sm:h-64 w-full bg-slate-50 rounded-2xl p-2 sm:p-4 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                        formatter={(value: number) => [`${value.toLocaleString()} km`, MILEAGE_LABEL[langGroup] || MILEAGE_LABEL.en]}
                      />
                      <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Serviso įrašai */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                    {t.report.serviceEvents}
                  </h3>
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showOriginalServiceTexts}
                      onChange={(e) => setShowOriginalServiceTexts(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    {t.report.showOriginal}
                  </label>
                </div>
                <div className="space-y-4">
                  {SERVICE_EVENTS.map((event, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-sm font-bold text-slate-800">{event.date}</span>
                        <span className="text-sm font-semibold text-indigo-600">
                          {event.mileage.toLocaleString()} km
                        </span>
                      </div>
                      {event.providerKey && (
                        <p className="text-xs sm:text-sm text-slate-600 mb-2">{getServiceProvider(event.providerKey)}</p>
                      )}
                      {event.type && (
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                          {event.type}
                        </span>
                      )}
                      {event.actionKeys && event.actionKeys.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          {event.actionKeys.map((actionKey, i) => (
                            <li key={i}>{getServiceAction(actionKey)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Žalų sekcija */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12" y1="17" y2="17.01"/></svg>
                  {t.report.damages}
                </h3>
                <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-sm font-semibold text-emerald-800">{NO_DAMAGES[langGroup] || NO_DAMAGES.en}</p>
                </div>
              </div>
            </div>

            {/* Šoninis skydelis */}
            <div className="bg-slate-50 lg:bg-transparent p-6 sm:p-8 lg:p-0 space-y-8 border-t lg:border-t-0 border-slate-100">
              {/* Rinkos vertė */}
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="text-indigo-900 font-bold mb-4 text-sm sm:text-base">{t.report.marketValue}</h4>
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1">
                  ~{MARKET_VALUE.average.toLocaleString()} €
                </div>
                <p className="text-xs text-indigo-700/70 mb-6">{t.report.marketValueBased}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] sm:text-xs uppercase font-bold tracking-wider">
                    <span className="text-indigo-900/40">{t.report.min}</span>
                    <span className="text-indigo-900/40">{t.report.max}</span>
                  </div>
                  <div className="w-full bg-indigo-200/50 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-2/3 ml-[15%]"></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-indigo-900">
                    <span>{MARKET_VALUE.min.toLocaleString()} €</span>
                    <span>{MARKET_VALUE.max.toLocaleString()} €</span>
                  </div>
                </div>
              </div>

              {/* AI: problemos ir stiprybės */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </div>
                <h4 className="font-bold mb-4 text-sm">{t.report.aiInsights}</h4>
                <div className="space-y-4 mb-4">
                  {analysis.problemAreas.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-2">
                        {t.report.problemAreas}
                      </h5>
                      <ul className="space-y-1.5">
                        {analysis.problemAreas.map((item, i) => (
                          <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysis.strongPoints.length > 0 && (
                    <div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 mb-2">
                        {t.report.strongPoints}
                      </h5>
                      <ul className="space-y-1.5">
                        {analysis.strongPoints.map((item, i) => (
                          <li key={i} className="text-[13px] text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-indigo-600 transition-colors"
          >
            {t.pricing.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;
