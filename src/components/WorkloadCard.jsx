import React from 'react';
import { Zap, Activity, Flame, Check } from 'lucide-react';

const icons = {
  light: Zap,
  moderate: Activity,
  busy: Flame,
};

export default function WorkloadCard({ workload, selected, onSelect }) {
  const Icon = icons[workload.id] || Activity;

  return (
    <div
      onClick={() => onSelect(workload.name)}
      className={`relative cursor-pointer rounded-xl border p-5 transition-all duration-200 ${
        selected
          ? 'border-amber-500/70 bg-slate-900 shadow-glow-amber'
          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              selected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white">{workload.name}</h4>
            <span className="text-xs font-mono text-slate-400">{workload.subhead}</span>
          </div>
        </div>
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            selected
              ? 'border-amber-400 bg-amber-400 text-slate-950'
              : 'border-slate-700 bg-slate-900'
          }`}
        >
          {selected && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400 leading-relaxed">
        {workload.description}
      </p>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-[11px]">
        <span className="text-slate-500">Target p95 Latency</span>
        <span className="font-mono text-slate-300">{workload.p95Target}</span>
      </div>
    </div>
  );
}
