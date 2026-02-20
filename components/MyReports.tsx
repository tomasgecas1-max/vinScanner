import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSavedReports, type SavedReport } from '../services/reportsFirestore';
import type { CarReport } from '../types';
import type { Translations } from '../constants/translations';

interface MyReportsProps {
  t: Translations;
  lang: string;
  isOpen: boolean;
  /** Padidėjimas po naujo ataskaitos išsaugojimo – sąrašas persikrauna */
  refreshKey?: number;
  onSelectReport: (report: CarReport) => void;
  onClose: () => void;
}

const MyReports: React.FC<MyReportsProps> = ({ t, lang, isOpen, refreshKey = 0, onSelectReport, onClose }) => {
  const { user } = useAuth();
  const [list, setList] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isOpen) return;
    setLoading(true);
    setError(null);
    getSavedReports(user.uid)
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error'))
      .finally(() => setLoading(false));
  }, [user, isOpen, refreshKey]);

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    const locale = lang === 'lt' ? 'lt-LT' : lang === 'de' ? 'de-DE' : 'en-GB';
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900">
            {t.myReports.title}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {loading && <p className="text-slate-500 text-sm py-8 text-center">{t.myReports.loading}</p>}
          {error && <p className="text-rose-600 text-sm py-4">{error}</p>}
          {!loading && !error && list.length === 0 && (
            <p className="text-slate-500 text-sm py-8 text-center">{t.myReports.noReports}</p>
          )}
          {!loading && !error && list.length > 0 && (
            <ul className="space-y-2">
              {list.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => { onSelectReport(s.report); onClose(); }}
                    className="w-full text-left px-4 py-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                  >
                    <span className="font-mono font-bold text-slate-900">{s.vin}</span>
                    <span className="block text-[11px] text-slate-500 mt-1">
                      {s.report.make} {s.report.model} · {formatDate(s.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReports;
