import React from 'react';
import type { Translations } from '../constants/translations';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
  t: Pick<Translations, 'about' | 'pricing'>;
}

const AboutModal: React.FC<AboutModalProps> = ({ open, onClose, t }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-black text-slate-900 mb-4">
            {t.about.title || 'About Us'}
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed mb-6">
            {t.about.body}
          </p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t.about.contactLabel}
          </p>
          <a
            href="mailto:info@vinscanner.eu"
            className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded"
          >
            info@vinscanner.eu
          </a>
        </div>
        <div className="px-6 pb-6 sm:px-8 sm:pb-8 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            {t.pricing.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
