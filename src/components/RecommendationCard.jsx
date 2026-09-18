import React from 'react';
import { Sparkles, ShieldCheck, Cpu, HardDrive, Database, Info } from 'lucide-react';
import ResourceCard from './ResourceCard';

export default function RecommendationCard({ recommendation, website, category, workload }) {
  if (!recommendation) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-slate-900/90 p-6 md:p-8 shadow-glow-amber">
      {/* Background glow decoration */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Recommended Starting Configuration
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            Demo Recommendation
          </span>
        </div>
      </div>

      {/* Tier Heading */}
      <div className="mt-6 flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
            {recommendation.tier.toUpperCase()}
            <span className="text-xs font-normal text-slate-400 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
              Tier Profile
            </span>
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            {recommendation.reasoningSummary}
          </p>
        </div>
      </div>

      {/* Spec Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResourceCard
          type="cpu"
          value={recommendation.cpu}
          unit="vCPU"
          label="Compute"
          highlight={true}
        />
        <ResourceCard
          type="ram"
          value={recommendation.ram}
          unit="GB RAM"
          label="Memory"
          highlight={true}
        />
        <ResourceCard
          type="storage"
          value={recommendation.storage}
          unit="GB NVMe"
          label="Storage"
          highlight={true}
        />
      </div>

      {/* Confidence Meter */}
      <div className="mt-6 rounded-xl bg-slate-950/80 p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Recommendation Confidence
            </span>
          </div>
          <span className="text-sm font-bold font-mono text-amber-400">
            {recommendation.confidence}% <span className="text-xs text-slate-400 font-sans font-normal">(High Match)</span>
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-1000"
            style={{ width: `${recommendation.confidence}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
          <Info className="h-3 w-3 shrink-0" />
          <span>Calculated using synthetic benchmark profiles & workload response models.</span>
        </p>
      </div>
    </div>
  );
}
