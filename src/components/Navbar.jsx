import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Product', path: '/' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Benchmarks', path: '/benchmarks' },
    { name: 'History', path: '/history' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border/60 bg-[#090D16]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Custom SiteScale Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 border border-slate-700/60 shadow-inner group-hover:border-amber-500/40 transition-colors">
            <div className="absolute inset-0 rounded-lg bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Layers className="h-5 w-5 text-amber-400 transform group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              SiteScale
              <span className="text-[10px] font-medium tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                Beta
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(link.path)
                  ? 'text-white bg-slate-800/80 border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/analyze')}
            className="relative inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all duration-200 shadow-glow-amber active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            <span>Analyze Website</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-[#090D16] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-amber-400 bg-slate-800/80 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/analyze');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-slate-900 bg-amber-400 font-semibold text-base shadow-glow-amber"
            >
              <Sparkles className="h-5 w-5" />
              <span>Analyze Website</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
