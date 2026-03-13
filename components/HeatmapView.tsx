'use client';

import { motion } from 'framer-motion';
import type { ATSAnalysisResult } from '@/types';

interface HeatmapViewProps {
  result: ATSAnalysisResult;
}

function getHeatColor(value: number) {
  if (value >= 80) return 'bg-green-500/70';
  if (value >= 60) return 'bg-cyan-500/60';
  if (value >= 40) return 'bg-amber-500/60';
  return 'bg-red-500/60';
}

export default function HeatmapView({ result }: HeatmapViewProps) {
  const sections = result.sectionBreakdown
    ? Object.entries(result.sectionBreakdown)
    : [];
  const keywords = result.keywordDensity
    ? Object.entries(result.keywordDensity)
    : [];

  if (sections.length === 0 && keywords.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-2xl p-4 border border-slate-700/50"
    >
      <h3 className="text-slate-200 font-semibold text-sm mb-3">
        Resume section scores
      </h3>
      <div className="space-y-3">
        {sections.map(([name, data]) => (
          <div key={name} className="flex items-center gap-3">
            <span className="text-slate-400 text-sm w-24 truncate">{name}</span>
            <div className="flex-1 h-6 rounded-lg bg-slate-800 overflow-hidden flex">
              <motion.div
                className={`h-full ${getHeatColor(data.score)}`}
                initial={{ width: 0 }}
                animate={{ width: `${data.score}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <span className="text-cyan-400 text-xs font-medium w-8 text-right">
              {data.score}
            </span>
          </div>
        ))}
        {keywords.slice(0, 8).map(([kw, value]) => (
          <div key={kw} className="flex items-center gap-3">
            <span className="text-slate-400 text-sm w-24 truncate" title={kw}>
              {kw.length > 12 ? `${kw.slice(0, 12)}…` : kw}
            </span>
            <div className="flex-1 h-5 rounded bg-slate-800 overflow-hidden flex">
              <motion.div
                className={`h-full ${getHeatColor(value)}`}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <span className="text-slate-400 text-xs w-8 text-right">
              {value}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
