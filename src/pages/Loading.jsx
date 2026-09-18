import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layers, Sparkles } from 'lucide-react';
import ProgressSteps from '../components/ProgressSteps';
import { analyzeWebsite } from '../services/api';

export default function Loading() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { url, category, workload } = location.state || {
    url: 'https://example.com',
    category: 'CMS / Blog',
    workload: 'Moderate',
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function start() {
      try {
        const result = await analyzeWebsite({
          url,
          category,
          workload,
          onProgress: ({ stepIndex, completed }) => {
            if (!isMounted) return;
            setCurrentStep(stepIndex);
            if (completed) setIsFinished(true);
          }
        });

        if (isMounted) {
          // Slight delay to show final step completion
          setTimeout(() => {
            navigate('/results', { state: { result } });
          }, 400);
        }
      } catch (err) {
        console.error('Analysis failed', err);
        navigate('/analyze');
      }
    }

    start();

    return () => {
      isMounted = false;
    };
  }, [url, category, workload, navigate]);

  const cleanDomain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0] || 'example.com';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/30 bg-slate-900/90 p-8 shadow-glow-amber text-center backdrop-blur-md space-y-6">
        
        {/* Animated Brand Icon */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-amber-500/40 text-amber-400 shadow-inner">
          <Layers className="h-8 w-8 animate-pulse" />
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 animate-ping" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Analyzing Application Signals
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Analyzing <span className="text-amber-400 font-mono">{cleanDomain}</span>
          </h2>
          <p className="text-xs text-slate-400">
            Category: <strong className="text-slate-200">{category}</strong> • Workload: <strong className="text-slate-200">{workload}</strong>
          </p>
        </div>

        {/* Step Loader Component */}
        <div className="flex justify-center pt-2">
          <ProgressSteps currentStep={currentStep} isFinished={isFinished} />
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
          This may take a few seconds. Do not refresh the page.
        </div>

      </div>
    </div>
  );
}
