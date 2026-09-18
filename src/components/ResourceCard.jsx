import React from 'react';
import { Cpu, HardDrive, Database } from 'lucide-react';

const icons = {
  cpu: Cpu,
  ram: Database,
  storage: HardDrive,
};

export default function ResourceCard({ type, value, unit, label, highlight }) {
  const Icon = icons[type] || Cpu;

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
        highlight
          ? 'border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/20 shadow-glow-amber'
          : 'border-slate-800 bg-slate-950'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-white">{value}</span>
        <span className="text-sm font-semibold text-slate-400 font-mono">{unit}</span>
      </div>
    </div>
  );
}
