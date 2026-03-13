'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Copy,
  Download,
  AlertTriangle,
  Zap,
  FileText,
  Layout,
  MessageSquare,
} from 'lucide-react';
import type { ATSAnalysisResult } from '@/types';

interface SuggestionsPanelProps {
  result: ATSAnalysisResult;
  onCopySummary: (text: string) => void;
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-slate-200 font-medium">
          <Icon className="w-4 h-4 text-cyan-400" />
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="text-slate-400"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-slate-700/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SuggestionsPanel({
  result,
  onCopySummary,
}: SuggestionsPanelProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedBullets, setCopiedBullets] = useState(false);

  const handleCopySummary = () => {
    onCopySummary(result.improvedSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadBullets = () => {
    const text = result.improvedBulletExamples.join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'improved-bullet-points.txt';
    a.click();
    URL.revokeObjectURL(url);
    setCopiedBullets(true);
    setTimeout(() => setCopiedBullets(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      {result.missingKeywords.length > 0 && (
        <div className="glass rounded-2xl p-4 border border-amber-500/20">
          <h3 className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
            <AlertTriangle className="w-4 h-4" />
            Missing keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-xs border border-amber-500/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.improvedSummary && (
        <div className="glass rounded-2xl p-4 border border-slate-700/50">
          <h3 className="text-slate-200 font-semibold text-sm mb-2">
            Improved summary
          </h3>
          <p className="text-slate-400 text-sm mb-3 whitespace-pre-wrap">
            {result.improvedSummary}
          </p>
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
          >
            <Copy className="w-4 h-4" />
            {copiedSummary ? 'Copied!' : 'Copy summary'}
          </button>
        </div>
      )}

      {result.improvedBulletExamples.length > 0 && (
        <div className="glass rounded-2xl p-4 border border-slate-700/50">
          <h3 className="text-slate-200 font-semibold text-sm mb-2">
            Improved bullet examples
          </h3>
          <ul className="text-slate-400 text-sm space-y-2 mb-3 list-disc list-inside">
            {result.improvedBulletExamples.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={handleDownloadBullets}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors border border-blue-500/30"
          >
            <Download className="w-4 h-4" />
            {copiedBullets ? 'Downloaded!' : 'Download as .txt'}
          </button>
        </div>
      )}

      <Section title="Skills" icon={Zap} defaultOpen>
        <ul className="text-slate-400 text-sm space-y-1">
          {(result.suggestions.skills || []).map((s, i) => (
            <li key={i}>• {s}</li>
          ))}
          {result.skillGapAnalysis?.length
            ? result.skillGapAnalysis.map((g, i) => (
                <li key={`gap-${i}`}>• {g}</li>
              ))
            : null}
          {(!result.suggestions.skills ||
            result.suggestions.skills.length === 0) &&
            (!result.skillGapAnalysis || result.skillGapAnalysis.length === 0) && (
              <li className="text-slate-500">No specific skill suggestions.</li>
            )}
        </ul>
      </Section>

      <Section title="Experience" icon={FileText}>
        <div className="space-y-2 text-slate-400 text-sm">
          {result.experienceFeedback && (
            <p className="whitespace-pre-wrap">{result.experienceFeedback}</p>
          )}
          <ul className="space-y-1">
            {(result.suggestions.experience || []).map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
            {(!result.suggestions.experience ||
              result.suggestions.experience.length === 0) &&
              !result.experienceFeedback && (
                <li className="text-slate-500">No experience suggestions.</li>
              )}
          </ul>
        </div>
      </Section>

      <Section title="Formatting" icon={Layout}>
        <div className="space-y-2 text-slate-400 text-sm">
          {result.formattingFeedback && (
            <p className="whitespace-pre-wrap">{result.formattingFeedback}</p>
          )}
          <ul className="space-y-1">
            {(result.suggestions.formatting || []).map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
            {(!result.suggestions.formatting ||
              result.suggestions.formatting.length === 0) &&
              !result.formattingFeedback && (
                <li className="text-slate-500">No formatting suggestions.</li>
              )}
          </ul>
        </div>
      </Section>

      <Section title="Summary & profile" icon={MessageSquare}>
        <div className="space-y-2 text-slate-400 text-sm">
          {result.resumeSummaryFeedback && (
            <p className="whitespace-pre-wrap">{result.resumeSummaryFeedback}</p>
          )}
          <ul className="space-y-1">
            {(result.suggestions.summary || []).map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
            {(!result.suggestions.summary ||
              result.suggestions.summary.length === 0) &&
              !result.resumeSummaryFeedback && (
                <li className="text-slate-500">No summary suggestions.</li>
              )}
          </ul>
        </div>
      </Section>

      {result.atsWarnings && result.atsWarnings.length > 0 && (
        <div className="glass rounded-2xl p-4 border border-amber-500/20">
          <h3 className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
            <AlertTriangle className="w-4 h-4" />
            ATS compatibility warnings
          </h3>
          <ul className="text-slate-400 text-sm space-y-1">
            {result.atsWarnings.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      {result.sectionBreakdown && Object.keys(result.sectionBreakdown).length > 0 && (
        <div className="glass rounded-2xl p-4 border border-slate-700/50">
          <h3 className="text-slate-200 font-semibold text-sm mb-3">
            Section breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(result.sectionBreakdown).map(([name, data]) => (
              <div key={name} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{name}</span>
                  <span className="text-cyan-400 font-medium">{data.score}/100</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500/80 to-blue-500/80 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.score}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                {data.notes?.length > 0 && (
                  <ul className="text-xs text-slate-500 mt-1">
                    {data.notes.map((n, i) => (
                      <li key={i}>• {n}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.keywordDensity && Object.keys(result.keywordDensity).length > 0 && (
        <div className="glass rounded-2xl p-4 border border-slate-700/50">
          <h3 className="text-slate-200 font-semibold text-sm mb-3">
            Keyword density
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(result.keywordDensity).map(([keyword, value]) => (
              <div
                key={keyword}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-2"
              >
                <span className="text-slate-300 text-sm">{keyword}</span>
                <span
                  className={`text-xs font-medium ${
                    value >= 70
                      ? 'text-green-400'
                      : value >= 40
                        ? 'text-amber-400'
                        : 'text-red-400'
                  }`}
                >
                  {value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
