import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Search, Trash2, ArrowRight, ExternalLink, Filter, Calendar } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Input from '../components/Input';
import EmptyState from '../components/EmptyState';
import { useAnalysis } from '../hooks/useAnalysis';

export default function History() {
  const navigate = useNavigate();
  const { historyList, handleDeleteHistory, handleClearHistory } = useAnalysis();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWorkload, setSelectedWorkload] = useState('all');

  // Filter history list
  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.website.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesWorkload =
      selectedWorkload === 'all' || item.workload === selectedWorkload;

    return matchesSearch && matchesCategory && matchesWorkload;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="amber" icon={HistoryIcon}>ANALYSIS HISTORY</Badge>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Previous Analyses
          </h1>
          <p className="text-sm text-slate-400">
            View, search, and manage your past website infrastructure sizing reports.
          </p>
        </div>

        {historyList.length > 0 && (
          <Button variant="danger" size="sm" onClick={handleClearHistory} icon={Trash2}>
            Clear History
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="md:col-span-6">
          <Input
            placeholder="Search by domain (e.g. example.com)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-3 focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Categories</option>
            <option value="CMS / Blog">CMS / Blog</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Dashboard / SaaS">Dashboard / SaaS</option>
            <option value="Custom Web API">Custom Web API</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedWorkload}
            onChange={(e) => setSelectedWorkload(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm px-3 py-3 focus:outline-none focus:border-amber-500/60"
          >
            <option value="all">All Workloads</option>
            <option value="Light">Light Workload</option>
            <option value="Moderate">Moderate Workload</option>
            <option value="Busy">Busy Workload</option>
          </select>
        </div>
      </div>

      {/* History List or Empty State */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          title={historyList.length === 0 ? "No analyses yet" : "No matching history found"}
          description={
            historyList.length === 0
              ? "Analyze your first website to generate data-driven CPU, RAM, and storage recommendations."
              : "Try adjusting your search query or filter selection."
          }
          actionText={historyList.length === 0 ? "Analyze Website Now" : null}
          onAction={() => navigate('/analyze')}
        />
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              hoverEffect={true}
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-slate-800/80 bg-slate-900/90"
            >
              {/* Left Column: Domain & Category */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white font-mono">{item.domain}</span>
                  <Badge variant="amber" size="sm">
                    {item.recommendation?.tier || 'Medium'} Tier
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>{item.category}</span>
                  <span className="text-slate-700">•</span>
                  <span>{item.workload}</span>
                  <span className="text-slate-700">•</span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Middle Specs */}
              <div className="flex items-center gap-6 border-y md:border-y-0 border-slate-800/60 py-3 md:py-0">
                <div className="text-center">
                  <div className="text-base font-bold text-white font-mono">{item.recommendation?.cpu} vCPU</div>
                  <div className="text-[10px] text-slate-400">Compute</div>
                </div>
                <div className="text-center border-x border-slate-800/60 px-4">
                  <div className="text-base font-bold text-white font-mono">{item.recommendation?.ram} GB</div>
                  <div className="text-[10px] text-slate-400">RAM</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-white font-mono">{item.recommendation?.storage} GB</div>
                  <div className="text-[10px] text-slate-400">Storage</div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/results', { state: { result: item } })}
                  icon={ArrowRight}
                >
                  View Details
                </Button>

                <button
                  onClick={() => handleDeleteHistory(item.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Delete from history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
