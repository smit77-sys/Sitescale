import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  BarChart3,
  Layers,
  Zap,
  Server,
  Activity,
  ArrowDown,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Background ambient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-start space-y-6 text-left"
          >
            <Badge variant="amber" icon={Sparkles}>
              AI-ASSISTED INFRASTRUCTURE SIZING
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Know exactly what <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                your website needs.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
              SiteScale analyzes your web application characteristics and recommends a practical, data-driven starting point for <strong className="text-white">CPU</strong>, <strong className="text-white">RAM</strong>, and <strong className="text-white">storage</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                onClick={() => navigate('/analyze')}
                icon={ArrowRight}
              >
                Analyze Your Website
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/benchmarks')}
              >
                Explore Benchmarks
              </Button>
            </div>

            {/* Quick stats / trust points */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80 w-full max-w-lg">
              <div>
                <div className="text-2xl font-bold font-mono text-white">400+</div>
                <div className="text-xs text-slate-400 mt-0.5">Synthetic Profiles</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-amber-400">sub-500ms</div>
                <div className="text-xs text-slate-400 mt-0.5">Target p95 SLA</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-400">87%+</div>
                <div className="text-xs text-slate-400 mt-0.5">Confidence Match</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-glow-amber backdrop-blur-xl">
              
              {/* Card Top */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">Site Analysis Preview</span>
              </div>

              {/* Target info */}
              <div className="mt-5 space-y-1">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">https://example.com</div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">example.com</h3>
                  <Badge variant="neutral" size="sm">CMS · Moderate</Badge>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="mt-6 rounded-xl bg-slate-950 p-5 border border-slate-800">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recommended Tier</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold tracking-tight text-white">MEDIUM</span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Benchmark Matched
                  </span>
                </div>

                {/* Specs */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <div className="text-base font-bold text-white font-mono">2 vCPU</div>
                    <div className="text-[10px] text-slate-400">Compute</div>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <div className="text-base font-bold text-white font-mono">4 GB</div>
                    <div className="text-[10px] text-slate-400">RAM</div>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <div className="text-base font-bold text-white font-mono">40 GB</div>
                    <div className="text-[10px] text-slate-400">Storage</div>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Confidence</span>
                  <span className="font-mono font-bold text-amber-400">87%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: '87%' }} />
                </div>
              </div>

              {/* Bottom tag */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Data-driven estimation
                </span>
                <span className="font-mono text-amber-400">Ghost CMS Profile</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 1 — PROBLEM STATEMENT */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber" icon={AlertTriangle}>THE PROBLEM</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Choosing infrastructure shouldn't be guesswork.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Developers often over-provision servers because they don't know what their application actually needs under realistic traffic.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect={true} className="border-red-500/20 bg-slate-900/60">
            <div className="text-xs font-mono font-bold text-red-400">01</div>
            <h3 className="mt-3 text-lg font-bold text-white flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
              Over-provisioning
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Paying hundreds of dollars monthly for 16 vCPU and 32 GB RAM servers when your application utilizes less than 10% capacity.
            </p>
          </Card>

          <Card hoverEffect={true} className="border-amber-500/20 bg-slate-900/60">
            <div className="text-xs font-mono font-bold text-amber-400">02</div>
            <h3 className="mt-3 text-lg font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Under-provisioning
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Suffering severe latency spikes, p95 degradation, and HTTP 504 gateway timeouts as soon as marketing campaigns drive traffic.
            </p>
          </Card>

          <Card hoverEffect={true} className="border-blue-500/20 bg-slate-900/60">
            <div className="text-xs font-mono font-bold text-blue-400">03</div>
            <h3 className="mt-3 text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              Blind Guesswork
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Picking cloud instances randomly based on blog tutorials instead of controlled benchmark data and observable app signals.
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 2 — HOW IT WORKS (4 STEPS) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-950/40 py-16 border-y border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber">METHODOLOGY</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How SiteScale Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            A structured, 4-step pipeline that turns public application signals into concrete infrastructure specs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-900 border border-slate-800 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold text-lg mb-4 border border-amber-500/20">
              01
            </div>
            <h3 className="text-base font-bold text-white">Enter Website</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Provide your public URL and select expected workload intensity.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-900 border border-slate-800 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 font-mono font-bold text-lg mb-4 border border-blue-500/20">
              02
            </div>
            <h3 className="text-base font-bold text-white">Analyze Signals</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Inspect framework footprint, static assets, HTTP headers & response structure.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-900 border border-slate-800 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 font-mono font-bold text-lg mb-4 border border-purple-500/20">
              03
            </div>
            <h3 className="text-base font-bold text-white">Match Benchmarks</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Cross-reference against 400+ synthetic load test benchmark profiles.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-900 border border-slate-800 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-bold text-lg mb-4 border border-emerald-500/20">
              04
            </div>
            <h3 className="text-base font-bold text-white">Get Recommendation</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Receive vCPU, RAM, storage specs with p95 latency estimations.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 3 — INFRASTRUCTURE VISUALIZATION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="blue">ARCHITECTURAL PIPELINE</Badge>
          <h2 className="text-3xl font-extrabold text-white">End-to-End Analysis Architecture</h2>
          <p className="text-sm text-slate-400">
            Visualizing how raw inputs travel through feature extraction to recommendation generation.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
            
            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900 border border-slate-800">
              <Server className="h-6 w-6 text-amber-400 mb-2" />
              <span className="text-xs font-bold text-white">Target URL</span>
              <span className="text-[10px] text-slate-500 font-mono">Input URL</span>
            </div>

            <div className="hidden lg:flex justify-center text-slate-600 font-bold">→</div>

            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900 border border-slate-800">
              <Activity className="h-6 w-6 text-blue-400 mb-2" />
              <span className="text-xs font-bold text-white">Profiler</span>
              <span className="text-[10px] text-slate-500 font-mono">Signal Scraper</span>
            </div>

            <div className="hidden lg:flex justify-center text-slate-600 font-bold">→</div>

            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900 border border-slate-800">
              <BarChart3 className="h-6 w-6 text-purple-400 mb-2" />
              <span className="text-xs font-bold text-white">Benchmarks</span>
              <span className="text-[10px] text-slate-500 font-mono">Dataset Match</span>
            </div>

            <div className="hidden lg:flex justify-center text-slate-600 font-bold">→</div>

            <div className="sm:col-span-2 lg:col-span-6 flex flex-col sm:flex-row items-center justify-around gap-4 mt-6 pt-6 border-t border-slate-800/80 bg-slate-900/50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Compute</div>
                  <div className="text-[11px] text-slate-400">1 - 8 vCPU</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-white">Memory</div>
                  <div className="text-[11px] text-slate-400">2 - 16 GB RAM</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">Storage</div>
                  <div className="text-[11px] text-slate-400">20 - 160 GB NVMe</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4 — BENCHMARK PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="amber">SYNTHETIC BENCHMARKS</Badge>
            <h2 className="text-3xl font-extrabold text-white mt-2">Built on measurable performance.</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Controlled k6 load testing profiles measuring throughput, latency distribution, and RAM headroom.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/benchmarks')}>
            View Full Benchmark Explorer →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white">Ghost CMS</span>
              <Badge variant="blue">CMS</Badge>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Light Workload</span>
                <span className="text-slate-200">5 req/s · 180ms p95</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Moderate Workload</span>
                <span className="text-amber-400 font-bold">25 req/s · 310ms p95</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Busy Workload</span>
                <span className="text-slate-200">75 req/s · 490ms p95</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white">Medusa Commerce</span>
              <Badge variant="amber">E-commerce</Badge>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Light Workload</span>
                <span className="text-slate-200">8 req/s · 220ms p95</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Moderate Workload</span>
                <span className="text-amber-400 font-bold">35 req/s · 380ms p95</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Busy Workload</span>
                <span className="text-slate-200">90 req/s · 580ms p95</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white">Grafana Metrics</span>
              <Badge variant="green">Dashboard</Badge>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Light Workload</span>
                <span className="text-slate-200">3 req/s · 140ms p95</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Moderate Workload</span>
                <span className="text-amber-400 font-bold">18 req/s · 260ms p95</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Busy Workload</span>
                <span className="text-slate-200">55 req/s · 410ms p95</span>
              </div>
            </div>
          </Card>

        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-10 md:p-14 text-center shadow-glow-amber">
          <Badge variant="amber" className="mb-4">READY TO SIZE?</Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Stop guessing your cloud infrastructure.
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-300 max-w-xl mx-auto">
            Analyze your application URL in seconds and get concrete CPU, RAM, and storage recommendations.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={() => navigate('/analyze')} icon={Sparkles}>
              Start Free Analysis Now
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
