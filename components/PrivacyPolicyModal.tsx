import React from 'react';
import { PRIVACY_POLICY } from '../content/privacy-policy';
import type { LangCode } from '../constants/translations';

const POLICY_LANGS = ['lt', 'en', 'de', 'pl', 'fr', 'es', 'it', 'nl', 'cs', 'uk', 'ro', 'sv', 'el', 'pt', 'hu', 'bg', 'sr', 'da', 'no', 'fi', 'sk', 'hr', 'bs', 'sq', 'sl', 'lv', 'mk', 'et', 'ca', 'lb', 'cnr', 'mt', 'is', 'tr'] as const;

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
  lang: LangCode;
  closeLabel: string;
}

/** Renders markdown-like content (bold **text**, tables) as simple HTML */
function formatPolicy(text: string): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const bold = (s: string) => s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const lines = text.trim().split('\n');
  let inTable = false;
  let tableHtml = '';
  const out: string[] = [];
  const flushTable = () => {
    if (inTable && tableHtml) {
      out.push(`<div class="overflow-x-auto my-4"><table class="min-w-full text-sm border border-slate-200 rounded-lg">${tableHtml}</table></div>`);
      tableHtml = '';
      inTable = false;
    }
  };
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('|') && t.endsWith('|')) {
      if (t.includes('---')) continue;
      inTable = true;
      const cells = t.split('|').slice(1, -1).map((c) => bold(escape(c.trim())));
      const tag = !tableHtml ? 'th' : 'td';
      tableHtml += `<tr>${cells.map((c) => `<${tag} class="border border-slate-200 px-3 py-2 text-left">${c}</${tag}>`).join('')}</tr>`;
      continue;
    }
    flushTable();
    if (t.startsWith('**') && t.endsWith('**'))
      out.push(`<p class="font-bold text-slate-900 mt-4 mb-1">${escape(t.slice(2, -2))}</p>`);
    else if (t) out.push(`<p class="text-slate-600 text-sm font-medium leading-relaxed mb-2">${bold(escape(t))}</p>`);
  }
  flushTable();
  return out.join('');
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ open, onClose, lang, closeLabel }) => {
  if (!open) return null;

  const policyLang = POLICY_LANGS.includes(lang as any) ? (lang as 'lt' | 'en' | 'de') : 'en';
  const content = PRIVACY_POLICY[policyLang];
  const html = formatPolicy(content);

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-black text-slate-900">
            {policyLang === 'lt' ? 'Privatumo politika' : policyLang === 'de' ? 'Datenschutzrichtlinie' : 'Privacy Policy'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            vinscanner.eu – GDPR
            {' · '}{policyLang === 'lt' ? 'Paskutinis atnaujinimas' : policyLang === 'de' ? 'Letzte Aktualisierung' : 'Last updated'}: 2026-02-28
          </p>
        </div>
        <div
          className="p-6 overflow-y-auto flex-1 [&_strong]:font-bold [&_strong]:text-slate-900"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="p-6 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
