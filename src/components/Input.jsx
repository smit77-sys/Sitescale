import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Input({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          className={`w-full rounded-lg bg-slate-950 border text-slate-100 placeholder-slate-500 text-sm px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-red-500/80 focus:border-red-500'
              : 'border-slate-800 focus:border-amber-500/60'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}
