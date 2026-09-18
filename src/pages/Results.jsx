import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Zap,
  BarChart2,
  Info,
  Server,
  Activity,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import RecommendationCard from '../components/RecommendationCard';
import BenchmarkChart from '../components/BenchmarkChart';
import { generateMockResult } from '../data/mockData';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fallback if accessed directly without state
  const result = location.state?.result || generateMockResult('https://example.com', 'CMS / Blog', 'Moderate');

  const [assumptionsExpanded, setAssumptionsExpanded] = useState(false);
  const [chartTab, setChartTab] = useState('latency'); // 'latency' | 'resources'

  const {
    website,
    domain,
    category,
    workload,
    recommendation,
    performance,
    resources,
    assumptions,
    tierComparison,
    chartData,
  } = result;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      
      {/* Navigation Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Analyze Another Site</span>
          </button>
          <span className="text-slate-700">|</span>
          <span className="text-xs font-mono text-amber-400">ID: {result.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/history')} icon={Activity}>
            View History
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/analyze')} icon={RotateCcw}>
            Re-Analyze
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="amber">Analysis Result</Badge>
          <span className="text-xs font-mono text-slate-500">• {result.timestamp}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
          {domain}
        </h1>
        <p className="text-sm text-slate-400">
          Application: <strong className="text-slate-200">{category}</strong> • Workload Profile: <strong className="text-slate-200">{workload}</strong>
        </p>
      </div>

      {/* 1. PRIMARY RECOMMENDATION CARD */}
      <RecommendationCard
        recommendation={recommendation}
        website={website}
        category={category}
        workload={workload}
      />

      {/* 2. WHY THIS RECOMMENDATION? */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Why this recommendation?
          </h3>
          <span className="text-xs text-slate-400 font-mono">Benchmark SLA Verification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-emerald-500/20 bg-slate-900/60 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Workload Matched</h4>
            <p className="text-xs text-slate-400 mt-1">
              Simulated against {workload.toLowerCase()} traffic models ({performance.throughput} req/s baseline).
            </p>
          </Card>

          <Card className="border-emerald-500/20 bg-slate-900/60 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Profile Matched</h4>
            <p className="text-xs text-slate-400 mt-1">
              Signal matches {category} application memory footprint & runtime requirements.
            </p>
          </Card>

          <Card className="border-emerald-500/20 bg-slate-900/60 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">SLA Within Target</h4>
            <p className="text-xs text-slate-400 mt-1">
              Estimated p95 response time ({performance.p95}ms) strictly below 500ms target limit.
            </p>
          </Card>

          <Card className="border-emerald-500/20 bg-slate-900/60 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mb-2" />
            <h4 className="text-sm font-bold text-white">Headroom Included</h4>
            <p className="text-xs text-slate-400 mt-1">
              Includes +25% memory & CPU headroom to absorb sudden traffic spikes gracefully.
            </p>
          </Card>
        </div>
      </div>

      {/* 3. RESOURCE COMPARISON TABLE */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Server className="h-5 w-5 text-amber-400" />
          Resource Tier Comparison
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Tier</th>
                <th className="px-6 py-3.5">vCPU</th>
                <th className="px-6 py-3.5">RAM</th>
                <th className="px-6 py-3.5">Storage</th>
                <th className="px-6 py-3.5">Result</th>
                <th className="px-6 py-3.5">Analysis Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {tierComparison.map((row) => {
                const isSelected = row.name.toLowerCase() === recommendation.tier.toLowerCase();

                return (
                  <tr
                    key={row.name}
                    className={`transition-colors ${
                      isSelected ? 'bg-amber-500/10 font-bold' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-6 py-4 font-sans text-sm text-white flex items-center gap-2">
                      {row.name}
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-400 text-slate-950">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-200">{row.cpu}</td>
                    <td className="px-6 py-4 text-slate-200">{row.ram}</td>
                    <td className="px-6 py-4 text-slate-200">{row.storage}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold font-sans ${
                          row.status === 'recommended'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : row.status === 'success'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                        }`}
                      >
                        {row.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-sans text-slate-400">{row.detail}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. PERFORMANCE SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">p95 Latency SLA</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{performance.p95} <span className="text-sm text-slate-400 font-sans font-normal">ms</span></div>
          <p className="text-xs text-slate-500">95% of synthetic test requests responded in under {performance.p95}ms.</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Throughput Target</span>
            <BarChart2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">{performance.throughput} <span className="text-sm text-slate-400 font-sans font-normal">req/s</span></div>
          <p className="text-xs text-slate-500">Sustained synthetic requests per second benchmark profile.</p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Error Rate</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">{performance.errorRate}%</div>
          <p className="text-xs text-slate-500">Zero HTTP 504 timeouts under test workload limits.</p>
        </Card>
      </div>

      {/* 5. INTERACTIVE CHARTS */}
      <Card className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Simulated Benchmark Performance Curve</h3>
            <p className="text-xs text-slate-400">Resource utilization and latency behavior across load cycles.</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartTab('latency')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                chartTab === 'latency' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              p95 Latency
            </button>
            <button
              onClick={() => setChartTab('resources')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                chartTab === 'resources' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              CPU & Memory %
            </button>
          </div>
        </div>

        <BenchmarkChart data={chartData} type={chartTab} />
      </Card>

      {/* 6. EXPANDABLE ASSUMPTIONS & LIMITATIONS */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6 space-y-4">
        <button
          onClick={() => setAssumptionsExpanded(!assumptionsExpanded)}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Assumptions & Limitations</h3>
          </div>
          {assumptionsExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>

        {assumptionsExpanded && (
          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
            {assumptions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <p className="leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
