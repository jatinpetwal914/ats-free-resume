'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ATSAnalysisResult } from '@/types';

interface ScoreCardProps {
  result: ATSAnalysisResult;
  onReanalyze: () => void;
  showConfetti: boolean;
}

export default function ScoreCard({
  result,
  onReanalyze,
  showConfetti,
}: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [displaySkills, setDisplaySkills] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const step = duration / steps;
    const scoreStep = result.score / steps;
    const skillsStep = result.skillsMatch / steps;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayScore(Math.min(Math.round(scoreStep * i), result.score));
      setDisplaySkills(Math.min(Math.round(skillsStep * i), result.skillsMatch));
      if (i >= steps) clearInterval(t);
    }, step);
    return () => clearInterval(t);
  }, [result.score, result.skillsMatch]);

  const scoreColor =
    result.score >= 85
      ? 'from-green-400 to-emerald-500'
      : result.score >= 70
        ? 'from-cyan-400 to-blue-500'
        : result.score >= 50
          ? 'from-amber-400 to-orange-500'
          : 'from-red-400 to-rose-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 md:p-8 border border-slate-700/50"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-shrink-0">
          <motion.div
            className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${scoreColor} p-1 shadow-glow`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <div className="w-full h-full rounded-full bg-[#0A0F1C] flex items-center justify-center">
              <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                {displayScore}
              </span>
            </div>
          </motion.div>
          <p className="text-center text-slate-400 text-sm mt-2 font-medium">
            ATS Score
          </p>
        </div>
        <div className="flex-1 w-full space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Skills match</span>
              <span className="text-cyan-400 font-medium">{displaySkills}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${result.skillsMatch}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          {(result.strengths?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-slate-300 font-semibold text-sm mb-2">
                Strengths
              </h4>
              <ul className="space-y-1">
                {result.strengths!.slice(0, 3).map((s, i) => (
                  <li
                    key={i}
                    className="text-slate-400 text-sm flex items-start gap-2"
                  >
                    <span className="text-green-400 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(result.weaknesses?.length ?? 0) > 0 && (
            <div>
              <h4 className="text-slate-300 font-semibold text-sm mb-2">
                Areas to improve
              </h4>
              <ul className="space-y-1">
                {result.weaknesses!.slice(0, 3).map((w, i) => (
                  <li
                    key={i}
                    className="text-slate-400 text-sm flex items-start gap-2"
                  >
                    <span className="text-amber-400 mt-0.5">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <motion.button
            type="button"
            onClick={onReanalyze}
            className="px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-sm font-medium transition-all hover:shadow-glow border border-slate-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Re-analyze
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
