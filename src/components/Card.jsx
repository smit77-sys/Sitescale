import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = false,
  amberBorder = false,
  ...props
}) {
  return (
    <div
      className={`rounded-xl border bg-slate-900/80 p-6 backdrop-blur-sm transition-all duration-200 ${
        amberBorder
          ? 'border-amber-500/40 shadow-glow-amber bg-slate-900/90'
          : 'border-slate-800/80 shadow-inner'
      } ${
        hoverEffect ? 'hover:border-slate-700 hover:shadow-lg hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
