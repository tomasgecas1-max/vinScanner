
import React from 'react';
import Logo from './Logo';

interface NavbarProps {
  lang: 'lt' | 'en';
  setLang: (lang: 'lt' | 'en') => void;
  t: any;
}

const Navbar: React.FC<NavbarProps> = ({ lang, setLang, t }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <a href="#" className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.nav.services}</a>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]"
            >
              {t.nav.pricing}
            </button>
            <a href="#" className="text-[11px] font-[900] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{t.nav.about}</a>
            
            {/* Kalbos pasirinkimas */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                onClick={() => setLang('lt')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${lang === 'lt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                LT
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${lang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                EN
              </button>
            </div>

            <button className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-indigo-200 active:scale-95">
              {t.nav.login}
            </button>
          </div>
          
          <button className="md:hidden p-3 text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
