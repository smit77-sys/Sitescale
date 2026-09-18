import { MOCK_HISTORY_PRESETS, BENCHMARKS, generateMockResult } from '../data/mockData';

const HISTORY_STORAGE_KEY = 'sitescale_analysis_history';

/**
 * Service API Abstraction layer.
 * Currently uses localStorage & mock generators.
 * Can be swapped to FastAPI backend endpoints when available.
 */
export async function analyzeWebsite({ url, category, workload, onProgress }) {
  // Define realistic step delays for loading visualization
  const steps = [
    { label: 'Connecting to website...', delay: 600 },
    { label: 'Inspecting page structure & response headers...', delay: 800 },
    { label: 'Extracting frontend & framework signals...', delay: 900 },
    { label: 'Comparing against benchmark profiles...', delay: 1000 },
    { label: 'Calculating recommended CPU, RAM, & Storage...', delay: 700 },
  ];

  for (let i = 0; i < steps.length; i++) {
    if (onProgress) {
      onProgress({
        stepIndex: i,
        totalSteps: steps.length,
        stepLabel: steps[i].label,
        completed: false,
      });
    }
    await new Promise((res) => setTimeout(res, steps[i].delay));
  }

  if (onProgress) {
    onProgress({
      stepIndex: steps.length,
      totalSteps: steps.length,
      stepLabel: 'Analysis complete!',
      completed: true,
    });
  }

  const result = generateMockResult(url, category, workload);
  
  // Auto-save to localStorage history
  saveHistoryItem(result);

  return result;
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      // Seed with initial demo history presets
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(MOCK_HISTORY_PRESETS));
      return MOCK_HISTORY_PRESETS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse history from localStorage', err);
    return MOCK_HISTORY_PRESETS;
  }
}

export function saveHistoryItem(item) {
  try {
    const history = getHistory();
    // Prepend new item, remove duplicates by domain
    const filtered = history.filter((h) => h.domain !== item.domain);
    const updated = [item, ...filtered];
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save item to history', err);
    return [];
  }
}

export function deleteHistoryItem(id) {
  try {
    const history = getHistory();
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete history item', err);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear history', err);
    return [];
  }
}

export function getBenchmarks() {
  return BENCHMARKS;
}
