import React from 'react';
import { Link } from 'react-router-dom';

export const LogoIcon = ({ className = 'h-9 w-9', size = 36 }) => (
  <div className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 p-2 text-white shadow-md shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105 ${className}`}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full text-white"
    >
      {/* Outer lens aperture ring */}
      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.4" strokeDasharray="4 2" />
      {/* Concentric focus ring */}
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75" />
      {/* Medical Cross with rounded caps */}
      <path
        d="M20 12V28M12 20H28"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Pulse / Heartbeat accent node */}
      <circle cx="20" cy="20" r="2.2" fill="currentColor" />
    </svg>
    {/* Ambient glass sheen */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/0 via-white/10 to-white/30 opacity-70 pointer-events-none" />
  </div>
);

export const Logo = ({
  size = 'md',
  showSubtitle = true,
  to = '/',
  clickable = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      icon: 'h-8 w-8',
      iconSize: 20,
      title: 'text-base font-extrabold',
      subtitle: 'text-[10px]',
      badge: 'text-[9px] px-1.5 py-0.2',
    },
    md: {
      icon: 'h-9 w-9',
      iconSize: 24,
      title: 'text-lg sm:text-xl font-extrabold',
      subtitle: 'text-[11px]',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      icon: 'h-12 w-12',
      iconSize: 32,
      title: 'text-2xl sm:text-3xl font-extrabold',
      subtitle: 'text-xs',
      badge: 'text-xs px-2.5 py-0.5',
    },
  }[size] || {
    icon: 'h-9 w-9',
    iconSize: 24,
    title: 'text-lg font-extrabold',
    subtitle: 'text-[11px]',
    badge: 'text-[10px] px-2 py-0.5',
  };

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      <LogoIcon className={sizeClasses.icon} size={sizeClasses.iconSize} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`${sizeClasses.title} tracking-tight text-slate-900 dark:text-white`}>
            Medi<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-teal-400">Lens</span>
          </span>
          <span className={`inline-flex items-center font-bold tracking-wider rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300 border border-blue-500/20 uppercase ${sizeClasses.badge}`}>
            AI PRO
          </span>
        </div>
        {showSubtitle && (
          <span className={`${sizeClasses.subtitle} font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5`}>
            Clinical Intelligence OS
          </span>
        )}
      </div>
    </div>
  );

  if (!clickable) return content;

  return (
    <Link
      to={to}
      className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-transform duration-140 active:scale-95"
    >
      {content}
    </Link>
  );
};

export default Logo;
