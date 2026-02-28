import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { ALL_LANGUAGES, type LangCode } from '../constants/translations';

function getCurrentLangInfo(code: LangCode) {
  return ALL_LANGUAGES.find((x) => x.code === code) ?? ALL_LANGUAGES[2];
}

interface NavbarProps {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: import('../constants/translations').Translations;
  onMyReportsClick?: () => void;
  onSampleReportClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, t, onMyReportsClick, onSampleReportClick }) => {
  const { user, loading, signInWithGoogle, signOut, deleteAccount, isFirebaseEnabled } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center" ref={menuRef}>
          <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <button onClick={() => scrollToSection('pricing')} className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.nav.pricing}</button>
            <button type="button" onClick={() => { onSampleReportClick?.(); setMenuOpen(false); }} className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.nav.sampleReport}</button>

            <div className="relative">
              <button
                onClick={() => { setLangDropdownOpen((o) => !o); setMenuOpen(false); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-[10px] font-black uppercase tracking-wide text-slate-700 transition-colors"
              >
                <span className="text-base">{getCurrentLangInfo(lang).flag}</span>
                <span>{getCurrentLangInfo(lang).name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-[min(90vw,520px)] max-h-[min(70vh,420px)] overflow-y-auto bg-white rounded-xl border border-slate-100 shadow-xl p-3 z-50 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                  {ALL_LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => { setLang(item.code); setLangDropdownOpen(false); }}
                      className={`text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${lang === item.code ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className="text-lg shrink-0">{item.flag}</span>
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isFirebaseEnabled && (
              loading ? (
                <span className="text-[10px] text-slate-400 uppercase">...</span>
              ) : user ? (
                <div className="relative">
                  <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wide">
                    <span className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-[11px]">{user.email?.[0]?.toUpperCase() ?? '?'}</span>
                    <span className="max-w-[120px] truncate text-slate-700">{user.email}</span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2">
                      {onMyReportsClick && (
                        <button onClick={() => { onMyReportsClick(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50">
                          {t.nav.myReports}
                        </button>
                      )}
                      <button onClick={() => { signOut(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
                        {t.nav.signOut}
                      </button>
                      <button onClick={() => { setMenuOpen(false); setDeleteModalOpen(true); setDeleteError(null); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50">
                        {t.nav.deleteAccount}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={signInWithGoogle} className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-indigo-200 active:scale-95">
                  {t.nav.login}
                </button>
              )
            )}
          </div>

          <div className="md:hidden flex items-center gap-2 relative">
            <div className="relative">
              <button
                onClick={() => { setLangDropdownOpen((o) => !o); setMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-[10px] font-black uppercase tracking-wide text-slate-700"
              >
                <span className="text-base">{getCurrentLangInfo(lang).flag}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={langDropdownOpen ? 'rotate-180' : ''}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 max-h-[min(70vh,380px)] overflow-y-auto bg-white rounded-xl border border-slate-100 shadow-xl py-1 z-[120]">
                  {ALL_LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => { setLang(item.code); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm font-medium ${lang === item.code ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className="text-lg">{item.flag}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {isFirebaseEnabled && !loading && !user && (
              <button onClick={signInWithGoogle} className="bg-slate-950 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wide">
                {t.nav.login}
              </button>
            )}
            {isFirebaseEnabled && user && (
              <>
                <button onClick={() => setMenuOpen((o) => !o)} className="p-2 rounded-xl bg-slate-100">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">{user.email?.[0]?.toUpperCase() ?? '?'}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-[110]">
                    {onMyReportsClick && (
                      <button onClick={() => { onMyReportsClick(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50">{t.nav.myReports}</button>
                    )}
                    <button onClick={() => { signOut(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">{t.nav.signOut}</button>
                    <button onClick={() => { setMenuOpen(false); setDeleteModalOpen(true); setDeleteError(null); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50">{t.nav.deleteAccount}</button>
                  </div>
                )}
              </>
            )}
            <button className="p-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors" aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={() => !deleteLoading && setDeleteModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-3">{t.nav.deleteAccountConfirm}</h3>
            <p className="text-slate-600 text-sm mb-6">{t.nav.deleteAccountConfirmText}</p>
            {deleteError && (
              <p className="text-rose-600 text-sm mb-4">{t.nav.deleteAccountError}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => !deleteLoading && setDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {t.pricing.close}
              </button>
              <button
                onClick={async () => {
                  setDeleteLoading(true);
                  setDeleteError(null);
                  const { success, error } = await deleteAccount();
                  setDeleteLoading(false);
                  if (success) {
                    setDeleteModalOpen(false);
                    signOut();
                  } else {
                    setDeleteError(error ?? t.nav.deleteAccountError);
                  }
                }}
                disabled={deleteLoading}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 disabled:opacity-70"
              >
                {deleteLoading ? t.nav.deleteAccountDeleting : t.nav.deleteAccountConfirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
