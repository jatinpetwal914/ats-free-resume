import type { AnalysisHistoryItem } from '@/types';

const STORAGE_KEY = 'ats-pro-history';
const MAX_ITEMS = 20;

export function getHistory(): AnalysisHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AnalysisHistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(item: Omit<AnalysisHistoryItem, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const list = getHistory();
  const newItem: AnalysisHistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const updated = [newItem, ...list].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // quota or parse error
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
