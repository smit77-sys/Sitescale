import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Cpu, Database, Server, Layers, ArrowRight, Code2, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="amber" icon={Terminal}>METHODOLOGY & ARCHITECTURE</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How SiteScale Sizes Infrastructure
        </h1>
        <p className="text-base text-slate-300 max-w-xl mx-auto">
          A data-driven pipeline built to replace guessing with empirical benchmark matching and signal profiling.
        </p>
      </div>

      {/* 5-Step Process Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { step: '01', title: 'Profile', desc: 'Inspect external HTTP headers, HTML DOM complexity, and script bundles.' },
          { step: '02', title: 'Extract', desc: 'Identify application signals, framework markers, and asset footprints.' },
          { step: '03', title: 'Benchmark', desc: 'Query 400+ synthetic load profiles for matching app patterns.' },
          { step: '04', title: 'Compare', desc: 'Evaluate vCPU and RAM requirements across SLA latency curves.' },
          { step: '05', title: 'Recommend', desc: 'Output concrete vCPU, RAM, and NVMe specs with safety headroom.' },
        ].map((s) => (
          <Card key={s.step} className="p-4 border-slate-800 bg-slate-900/80 space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400">{s.step}</span>
            <h3 className="text-base font-bold text-white">{s.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          </Card>
        ))}
      </div>

      {/* TECHNICAL ARCHITECTURE DIAGRAM FOR JUDGES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Code2 className="h-6 w-6 text-amber-400" />
            Full System Architecture
          </h2>
          <Badge variant="blue">Hackathon & Tech Spec</Badge>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-6 md:p-8 space-y-8 shadow-glow-amber">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-auto">
              <span className="text-[10px] font-mono text-amber-400 uppercase">Frontend</span>
              <h4 className="text-base font-bold text-white">React + Vite SPA</h4>
              <p className="text-xs text-slate-400">Tailwind • Framer Motion • Recharts</p>
            </div>

            <span className="text-amber-400 font-mono font-bold">↓</span>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-auto">
              <span className="text-[10px] font-mono text-blue-400 uppercase">API Gateway</span>
              <h4 className="text-base font-bold text-white">FastAPI Backend</h4>
              <p className="text-xs text-slate-400">REST Endpoints & Validation</p>
            </div>

            <span className="text-amber-400 font-mono font-bold">↓</span>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-auto">
              <span className="text-[10px] font-mono text-purple-400 uppercase">Signal Engine</span>
              <h4 className="text-base font-bold text-white">Website Profiler</h4>
              <p className="text-xs text-slate-400">HTTP & DOM Signal Extraction</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-auto">
              <span className="text-[10px] font-mono text-emerald-400 uppercase">Dataset</span>
              <h4 className="text-base font-bold text-white">Benchmark Storage</h4>
              <p className="text-xs text-slate-400">k6 Load Profile Repository</p>
            </div>

            <span className="text-amber-400 font-mono font-bold">↓</span>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 w-full md:w-auto">
              <span className="text-[10px] font-mono text-amber-400 uppercase">ML Model</span>
              <h4 className="text-base font-bold text-white">Sizing Engine</h4>
              <p className="text-xs text-slate-400">Resource Matching & Headroom</p>
            </div>

            <span className="text-amber-400 font-mono font-bold">↓</span>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 w-full md:w-auto">
              <span className="text-[10px] font-mono text-amber-400 uppercase">Output</span>
              <h4 className="text-base font-bold text-white">Infra Spec</h4>
              <p className="text-xs text-amber-300">vCPU + RAM + Storage</p>
            </div>
          </div>

        </div>
      </section>

      {/* Sizing Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Resource Headroom Formula</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            SiteScale calculates recommended vCPU and RAM using an additive headroom formula:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800">
            Recommended RAM = Baseline_RAM * 1.25 + Spike_Buffer
          </div>
          <p className="text-[11px] text-slate-400">
            This prevents sudden traffic spikes from causing out-of-memory kernel kills (OOM kills).
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <CheckCircle className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Transparent Limitations</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Public URL analysis cannot inspect internal SQL queries, redis cache hit ratios, or background worker queues.
          </p>
          <p className="text-xs text-slate-400">
            SiteScale explicitly labels all estimations with assumptions and limitations so engineering teams can make informed decisions.
          </p>
        </Card>
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 text-center">
        <Button size="lg" onClick={() => navigate('/analyze')} icon={Sparkles}>
          Try the Analyzer Now
        </Button>
      </div>

    </div>
  );
}
