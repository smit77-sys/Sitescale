import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Globe, FileText, ShoppingCart, LayoutDashboard, Code2, AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Badge from '../components/Badge';
import WorkloadCard from '../components/WorkloadCard';
import { CATEGORIES, WORKLOADS } from '../data/mockData';
import { useAnalysis } from '../hooks/useAnalysis';

const categoryIcons = {
  FileText: FileText,
  ShoppingCart: ShoppingCart,
  LayoutDashboard: LayoutDashboard,
  Code2: Code2,
};

export default function Analyze() {
  const navigate = useNavigate();
  const {
    url,
    setUrl,
    category,
    setCategory,
    workload,
    setWorkload,
    error,
    setError,
    validateUrl,
  } = useAnalysis();

  const [inputTouched, setInputTouched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputTouched(true);

    const valErr = validateUrl(url);
    if (valErr) {
      setError(valErr);
      return;
    }

    // Navigate to loading page with state
    navigate('/analyze/loading', {
      state: { url, category, workload }
    });
  };

  const handleQuickPreset = (presetUrl, presetCat, presetWorkload) => {
    setUrl(presetUrl);
    setCategory(presetCat);
    setWorkload(presetWorkload);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <Badge variant="amber" icon={Sparkles}>URL & WORKLOAD PROFILER</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze your website
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
          Tell us about your application to calculate the optimal starting vCPU, RAM, and storage allocation.
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="p-6 sm:p-8 border-slate-800 bg-slate-900/90 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* STEP 1: Website URL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                1. Website URL <span className="text-amber-400">*</span>
              </label>
              <span className="text-xs font-mono text-slate-500">Supports HTTPS</span>
            </div>

            <Input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (inputTouched) {
                  setError(validateUrl(e.target.value));
                }
              }}
              onBlur={() => {
                setInputTouched(true);
                setError(validateUrl(url));
              }}
              icon={Globe}
              error={error}
            />

            {/* Quick Demo Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500">Try demo preset:</span>
              <button
                type="button"
                onClick={() => handleQuickPreset('https://ghost.org', 'CMS / Blog', 'Moderate')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                ghost.org (CMS)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('https://medusajs.com', 'E-commerce', 'Busy')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                medusajs.com (Store)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('https://grafana.com', 'Dashboard / SaaS', 'Light')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
              >
                grafana.com (Dashboard)
              </button>
            </div>
          </div>

          {/* STEP 2: Application Category */}
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              2. Application Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const IconComp = categoryIcons[cat.icon] || FileText;
                const isSelected = category === cat.name;

                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.name)}
                    className={`cursor-pointer flex items-start gap-3 p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-amber-500/70 bg-amber-500/10 text-white shadow-glow-amber'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{cat.name}</span>
                      <span className="text-xs text-slate-400 mt-0.5">{cat.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Expected Workload */}
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              3. Expected Workload
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {WORKLOADS.map((wl) => (
                <WorkloadCard
                  key={wl.id}
                  workload={wl}
                  selected={workload === wl.name}
                  onSelect={(name) => setWorkload(name)}
                />
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              * Public URL analysis observes external HTTP signals & benchmark profiles.
            </p>
            <Button
              type="submit"
              size="lg"
              icon={Sparkles}
              disabled={!!error && inputTouched}
            >
              Analyze Website →
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
}
