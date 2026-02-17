'use client';

import { motion } from 'framer-motion';
import { History, Trash2 } from 'lucide-react';
import type { AnalysisHistoryItem } from '@/types';

interface HistoryPanelProps {
  items: AnalysisHistoryItem[];
  onSelect: (item: AnalysisHistoryItem) => void;
  onClear: () => void;
}

export default function HistoryPanel({
  items,
  onSelect,
  onClear,
}: HistoryPanelProps) {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 border border-slate-700/50"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <History className="w-4 h-4 text-cyan-400" />
          Recent analyses
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>
      <ul className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
        {items.slice(0, 5).map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/30"
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm truncate flex-1">
                  {item.fileName}
                </span>
                <span
                  className={`text-xs font-semibold ml-2 ${
                    item.score >= 85
                      ? 'text-green-400'
                      : item.score >= 70
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                  }`}
                >
                  {item.score}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {item.company} · {item.role}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
