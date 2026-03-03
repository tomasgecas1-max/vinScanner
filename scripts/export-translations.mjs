#!/usr/bin/env node
/**
 * Export all translations to a single Markdown file.
 * Run: node scripts/export-translations.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Parse TS object with template literals - extract key: `content` pairs
function extractFromTs(content, objName) {
  const regex = new RegExp(`${objName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const`, 'm');
  const match = content.match(regex);
  if (!match) return {};
  const body = match[1];
  const result = {};
  const keyRegex = /(\w+):\s*`([\s\S]*?)`(?!`)/g;
  let m;
  while ((m = keyRegex.exec(body)) !== null) {
    result[m[1]] = m[2].trim();
  }
  return result;
}

const usageRaw = readFileSync(join(root, 'content/usage-instructions.ts'), 'utf-8');
const privacyRaw = readFileSync(join(root, 'content/privacy-policy.ts'), 'utf-8');

const usage = extractFromTs(usageRaw, 'USAGE_INSTRUCTIONS');
const privacy = extractFromTs(privacyRaw, 'PRIVACY_POLICY');

// Refund policy - only lt, en, de have full text
const refund = {
  lt: 'Naudotojas turi teisę per 30 dienų nuo įsigijimo dienos atsisakyti Paslaugų (Ataskaitų), pateikdamas prašymą el. paštu ir nurodydamas užsakymo numerį, užsakymo datą bei savo kontaktinius duomenis. Pinigai grąžinami per 14 dienų nuo prašymo gavimo.\n\nGrąžinimas netaikomas, jei ataskaita jau buvo panaudota transporto priemonės istorijai tikrinti arba jei iš įsigyto ataskaitų paketo buvo panaudota bent viena ataskaita.',
  en: 'The user has the right to withdraw from the Services (Reports) within 30 days of the purchase date by submitting a request by email, indicating the order number, order date and contact details. The refund is processed within 14 days of receiving the request.\n\nRefunds do not apply if the report has already been used to verify the vehicle history or if at least one report from the purchased report package has been used.',
  de: 'Der Nutzer hat das Recht, innerhalb von 30 Tagen ab dem Kaufdatum von den Leistungen (Berichten) zurückzutreten, indem er einen Antrag per E-Mail einreicht und die Bestellnummer, das Bestelldatum und seine Kontaktdaten angibt. Die Rückerstattung erfolgt innerhalb von 14 Tagen nach Erhalt des Antrags.\n\nRückerstattungen gelten nicht, wenn der Bericht bereits zur Überprüfung der Fahrzeughistorie verwendet wurde oder wenn mindestens ein Bericht aus dem gekauften Berichtspaket verwendet wurde.',
};

const langNames = {
  lt: 'Lietuvių', en: 'English', de: 'Deutsch', pl: 'Polski', fr: 'Français', es: 'Español',
  it: 'Italiano', nl: 'Nederlands', uk: 'Українська', cs: 'Čeština', ro: 'Română', sv: 'Svenska',
  el: 'Ελληνικά', pt: 'Português', hu: 'Magyar', bg: 'Български', sr: 'Српски', da: 'Dansk',
  no: 'Norsk', fi: 'Suomi', sk: 'Slovenčina', hr: 'Hrvatski', bs: 'Bosanski', sq: 'Shqip',
  sl: 'Slovenščina', lv: 'Latviešu', mk: 'Македонски', et: 'Eesti', ca: 'Català', lb: 'Lëtzebuergesch',
  cnr: 'Crnogorski', mt: 'Malti', is: 'Íslenska', tr: 'Türkçe',
};

let md = `# vinscanner.eu – Pilni vertimai

Vienas failas su visais pilnais vertimais.

---

# A. NAUDOJIMO INSTRUKCIJOS

`;

for (const [code, name] of Object.entries(langNames)) {
  const text = usage[code];
  if (text) {
    md += `## ${code} (${name})\n\n${text}\n\n---\n\n`;
  }
}

md += `# B. PRIVATUMO POLITIKA

`;

for (const [code, name] of Object.entries(langNames)) {
  const text = privacy[code];
  if (text) {
    md += `## ${code} (${name})\n\n${text}\n\n---\n\n`;
  }
}

md += `# C. PINIGŲ GRĄŽINIMO POLITIKA

`;

for (const [code, name] of Object.entries(langNames)) {
  const text = refund[code] || refund.en;
  md += `## ${code} (${name})\n\n${text}\n\n---\n\n`;
}

md += `\n_* Kitos kalbos (ne lt, en, de) – rodomas anglų kalbos tekstas kaip nuoroda._\n`;

writeFileSync(join(root, 'pilni-vertimai.md'), md, 'utf-8');
console.log('Sukurtas: pilni-vertimai.md');
