import React from 'react';
import { Check, Loader2, Circle } from 'lucide-react';

const steps = [
  'Connecting to website',
  'Inspecting page structure & response headers',
  'Extracting application signals',
  'Comparing benchmark profiles',
  'Calculating recommended configuration',
];

export default function ProgressSteps({ currentStep = 0, isFinished = false }) {
  return (
    <div className="w-full max-w-md space-y-3">
      {steps.map((label, index) => {
        const isDone = isFinished || index < currentStep;
        const isCurrent = !isFinished && index === currentStep;
        const isPending = !isFinished && index > currentStep;

        return (
          <div
            key={index}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-lg border transition-all duration-300 ${
              isDone
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                : isCurrent
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-glow-amber'
                : 'border-slate-800 bg-slate-950/40 text-slate-600'
            }`}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              {isDone ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </div>
              ) : isCurrent ? (
                <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
              ) : (
                <Circle className="h-4 w-4 text-slate-700" />
              )}
            </div>
            <span className={`text-sm font-medium ${isDone ? 'text-slate-200' : isCurrent ? 'text-white font-semibold' : 'text-slate-500'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
