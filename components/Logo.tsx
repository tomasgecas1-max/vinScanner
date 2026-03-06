
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', onClick }) => {
  const fontSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl lg:text-4xl',
    lg: 'text-4xl sm:text-6xl lg:text-7xl'
  };

  return (
    <div
      className={`flex items-center group cursor-pointer select-none transition-transform active:scale-95 ${className}`}
      onClick={onClick}
    >
      {/* VinScanner.eu */}
      <div className={`${fontSizes[size]} font-bold tracking-tight text-slate-950 leading-[1.1] whitespace-nowrap`}>
        <span>Vin</span>
        <span className="text-indigo-600">Scanner</span>
        <span className="text-slate-400 text-[0.38em] ml-1 lowercase font-medium">.eu</span>
      </div>
    </div>
  );
};

export default Logo;
