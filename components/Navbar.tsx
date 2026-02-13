import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  lang: 'lt' | 'en';
  setLang: (lang: 'lt' | 'en') => void;
  t: any;
  onMyReportsClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, t, onMyReportsClick }) => {
  const { user, loading, signInWithGoogle, signOut, isFirebaseEnabled } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
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
            <a href="#" className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.nav.services}</a>
            <button onClick={() => scrollToSection('pricing')} className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.nav.pricing}</button>
            <a href="#" className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.nav.about}</a>

            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button onClick={() => setLang('lt')} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${lang === 'lt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>LT</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
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
                      <button onClick={() => { signOut(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50">
                        {t.nav.signOut}
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
                    <button onClick={() => { signOut(); setMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50">{t.nav.signOut}</button>
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
    </nav>
  );
};

export default Navbar;
