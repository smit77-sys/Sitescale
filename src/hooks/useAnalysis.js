import { useState, useCallback } from 'react';
import { analyzeWebsite, getHistory, deleteHistoryItem, clearHistory } from '../services/api';

export function useAnalysis() {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('CMS / Blog');
  const [workload, setWorkload] = useState('Moderate');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressState, setProgressState] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  const [historyList, setHistoryList] = useState(() => getHistory());

  const validateUrl = useCallback((inputUrl) => {
    if (!inputUrl || inputUrl.trim() === '') {
      return 'Please enter a website URL.';
    }
    const trimmed = inputUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'Please enter a valid URL starting with https:// or http://';
    }
    try {
      new URL(trimmed);
      return null;
    } catch (_) {
      return 'Please enter a valid URL (e.g. https://example.com)';
    }
  }, []);

  const runAnalysis = useCallback(async (customUrl, customCat, customWorkload) => {
    const targetUrl = customUrl || url;
    const targetCat = customCat || category;
    const targetWorkload = customWorkload || workload;

    const validationErr = validateUrl(targetUrl);
    if (validationErr) {
      setError(validationErr);
      return null;
    }

    setError(null);
    setIsAnalyzing(true);
    setProgressState({ stepIndex: 0, totalSteps: 5, stepLabel: 'Connecting to website...', completed: false });

    try {
      const result = await analyzeWebsite({
        url: targetUrl,
        category: targetCat,
        workload: targetWorkload,
        onProgress: (p) => setProgressState(p),
      });

      setCurrentResult(result);
      setHistoryList(getHistory());
      setIsAnalyzing(false);
      return result;
    } catch (err) {
      setError(err.message || 'Something went wrong while analyzing the website.');
      setIsAnalyzing(false);
      return null;
    }
  }, [url, category, workload, validateUrl]);

  const handleDeleteHistory = useCallback((id) => {
    const updated = deleteHistoryItem(id);
    setHistoryList(updated);
  }, []);

  const handleClearHistory = useCallback(() => {
    const updated = clearHistory();
    setHistoryList(updated);
  }, []);

  return {
    url,
    setUrl,
    category,
    setCategory,
    workload,
    setWorkload,
    isAnalyzing,
    progressState,
    currentResult,
    setCurrentResult,
    error,
    setError,
    validateUrl,
    runAnalysis,
    historyList,
    handleDeleteHistory,
    handleClearHistory,
  };
}
