import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Cpu, Database, Zap, Activity, Info, ArrowRight, ShieldAlert } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import BenchmarkChart from '../components/BenchmarkChart';
import { getBenchmarks } from '../services/api';

export default function Benchmarks() {
  const navigate = useNavigate();
  const benchmarks = getBenchmarks();

  const [selectedAppId, setSelectedAppId] = useState(benchmarks[0].id);
  const [selectedWorkload, setSelectedWorkload] = useState('moderate');

  const selectedApp = benchmarks.find((b) => b.id === selectedAppId) || benchmarks[0];
  const metrics = selectedApp.metrics[selectedWorkload];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="amber" icon={BarChart3}>BENCHMARK EXPLORER</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built on measurable performance.
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Explore synthetic load test data across real application engines under controlled traffic workloads.
          </p>
        </div>

        <Button onClick={() => navigate('/analyze')} icon={ArrowRight}>
          Analyze Your App
        </Button>
      </div>

      {/* Application Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {benchmarks.map((app) => {
          const isActive = app.id === selectedAppId;
          return (
            <button
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-glow-amber'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {app.name}
            </button>
          );
        })}
      </div>

      {/* Application Detail Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: App Specs & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-amber-500/30 bg-slate-900/90 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-white">{selectedApp.name}</h2>
              <Badge variant="amber">{selectedApp.category}</Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedApp.description}
            </p>

            {/* Workload selector inside detail */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Workload Profile Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'moderate', 'busy'].map((wl) => (
                  <button
                    key={wl}
                    onClick={() => setSelectedWorkload(wl)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                      selectedWorkload === wl
                        ? 'bg-slate-800 text-amber-400 border border-amber-500/50'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-900 border border-slate-800'
                    }`}
                  >
                    {wl}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Sustained RPS</span>
                <span className="text-xl font-bold font-mono text-white">{metrics.reqPerSec} req/s</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">p95 Latency</span>
                <span className="text-xl font-bold font-mono text-amber-400">{metrics.p95Latency} ms</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">CPU Peak</span>
                <span className="text-xl font-bold font-mono text-slate-200">{metrics.cpu}%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">RAM Peak</span>
                <span className="text-xl font-bold font-mono text-slate-200">{metrics.ram} MB</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="text-slate-300">Recommended Tier for {selectedWorkload}:</span>
              <span className="font-bold font-mono text-amber-400 uppercase">
                {selectedApp.recommendedTier[selectedWorkload]}
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Chart Curve */}
        <div className="lg:col-span-7">
          <Card className="h-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Load Curve: RPS vs Latency Distribution</h3>
                <p className="text-xs text-slate-400">p50, p90, p95, p99 percentile latency under increasing request rate.</p>
              </div>
              <Badge variant="neutral" size="sm">Synthetic k6 Test</Badge>
            </div>

            <div className="pt-4">
              <BenchmarkChart data={selectedApp.chartData} type="latency" />
            </div>
          </Card>
        </div>

      </div>

      {/* BENCHMARK METHODOLOGY EXPLANATION */}
      <Card className="space-y-6 bg-slate-950/80 border-slate-800">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Info className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Benchmark Methodology</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">1. Controlled Environment</h4>
            <p className="text-slate-400 leading-relaxed">
              All benchmarks are run inside isolated Docker containers on standardized bare-metal hardware with fixed CPU throttling and cgroup memory limits.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">2. Latency SLA Percentiles</h4>
            <p className="text-slate-400 leading-relaxed">
              We record p50 (median), p90, p95, and p99 latency spikes. A configuration is deemed "Not Sufficient" if p95 exceeds 500ms under target load.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">3. Synthetic Load Generation</h4>
            <p className="text-slate-400 leading-relaxed">
              Using k6 and Locust scripts, we simulate concurrent user sessions navigating catalog pages, submitting forms, and executing search queries.
            </p>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>Note: Benchmark data presented here consists of synthetic demonstration metrics calibrated against standard cloud instance families.</span>
        </div>
      </Card>

    </div>
  );
}
