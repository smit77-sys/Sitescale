import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Github, Terminal, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-surface-border bg-[#060911] text-slate-400 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-700/60 text-amber-400">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">SiteScale</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              AI-assisted infrastructure sizing for modern web applications. Analyze workload characteristics and benchmark profiles to eliminate guesswork in server provisioning.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com/smit77-sys/Sitescale"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>smit77-sys/Sitescale</span>
              </a>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Demo v1.0
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/analyze" className="hover:text-amber-400 transition-colors">Website Profiler</Link>
              </li>
              <li>
                <Link to="/benchmarks" className="hover:text-amber-400 transition-colors">Benchmark Explorer</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-amber-400 transition-colors">Analysis History</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-amber-400 transition-colors">Methodology</Link>
              </li>
            </ul>
          </div>

          {/* Resources & Technical */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Technical Specs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Architecture Spec</span>
                </Link>
              </li>
              <li>
                <Link to="/benchmarks" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>vCPU & Memory Curves</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/smit77-sys/Sitescale"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SiteScale. Built for data-driven cloud infrastructure sizing.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
