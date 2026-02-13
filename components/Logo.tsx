
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', onClick }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const fontSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-5xl'
  };

  return (
    <div 
      className={`flex items-center gap-3 group cursor-pointer select-none transition-transform active:scale-95 ${className}`}
      onClick={onClick}
    >
      {/* Geometrinis Simbolis */}
      <div className={`relative ${iconSizes[size]} shrink-0`}>
        <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-slate-950 rounded-xl shadow-2xl group-hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-700 opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center p-2 text-white">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
              <path d="M12 18V9" className="opacity-40" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/20 to-white/0 -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out"></div>
        </div>
      </div>
      
      {/* Tipografija */}
      <div className={`${fontSizes[size]} font-[900] tracking-[-0.06em] text-slate-950 flex items-baseline leading-none uppercase`}>
        <span>Vin</span>
        <span className="text-indigo-600">Scanner</span>
        <span className="text-slate-400 text-[0.4em] ml-1 lowercase font-bold">.eu</span>
      </div>
    </div>
  );
};

export default Logo;
