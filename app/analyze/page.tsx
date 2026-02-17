'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, FileDown } from 'lucide-react';
import UploadCard from '@/components/UploadCard';
import Loader from '@/components/Loader';
import ScoreCard from '@/components/ScoreCard';
import SuggestionsPanel from '@/components/SuggestionsPanel';
import HeatmapView from '@/components/HeatmapView';
import HistoryPanel from '@/components/HistoryPanel';
import BackgroundBlobs from '@/components/BackgroundBlobs';
import { getJobDescription, getCompanies, getRolesByCompany } from '@/data/jobDescriptions';
import { getHistory, saveToHistory, clearHistory } from '@/lib/history';
import { downloadReportAsPDF } from '@/lib/downloadReport';
import type { ATSAnalysisResult, AnalysisHistoryItem } from '@/types';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [customJD, setCustomJD] = useState('');
  const [companies] = useState(() => getCompanies());
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    if (company) {
      setRoles(getRolesByCompany(company));
      setRole('');
    } else {
      setRoles([]);
      setRole('');
    }
  }, [company]);

  const jobDescription = customJD.trim()
    ? customJD.trim()
    : company && role
      ? getJobDescription(company, role) ?? ''
      : '';

  const analyze = useCallback(async () => {
    if (!file || !jobDescription) {
      setError('Please upload a resume and provide or select a job description.');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobDescription', jobDescription);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data as ATSAnalysisResult);
      if (data.score >= 85) setShowConfetti(true);
      saveToHistory({
        fileName: file.name,
        company: company || 'Custom',
        role: role || 'Custom',
        score: data.score,
        result: data as ATSAnalysisResult,
      });
      setHistory(getHistory());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [file, jobDescription, company, role]);

  const handleReanalyze = useCallback(() => {
    setResult(null);
    setShowConfetti(false);
  }, []);

  const handleCopySummary = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const handleSelectHistory = useCallback((item: AnalysisHistoryItem) => {
    setResult(item.result);
  }, []);

  const handleSaveReport = useCallback(() => {
    if (!result || !file) return;
    downloadReportAsPDF(
      result,
      file.name,
      company || 'Custom',
      role || 'Custom'
    );
  }, [result, file, company, role]);

  return (
    <main className="relative min-h-screen px-4 py-8 pb-24">
      <BackgroundBlobs />
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            ATS Pro Resume Analyzer
          </h1>
          <div className="w-20" />
        </motion.div>

        {!result ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <UploadCard
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                  disabled={loading}
                />
                <div className="glass rounded-2xl p-4 border border-slate-700/50 space-y-3">
                  <label className="block text-slate-300 font-medium text-sm">
                    Company
                  </label>
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none"
                  >
                    <option value="">Select or use custom below</option>
                    {companies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <label className="block text-slate-300 font-medium text-sm">
                    Job role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none"
                  >
                    <option value="">Select role</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <label className="block text-slate-300 font-medium text-sm">
                    Or paste job description
                  </label>
                  <textarea
                    value={customJD}
                    onChange={(e) => setCustomJD(e.target.value)}
                    placeholder="Paste full job description here..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600 text-slate-200 text-sm placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 outline-none resize-none scrollbar-thin"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <HistoryPanel
                  items={history}
                  onSelect={handleSelectHistory}
                  onClear={() => {
                    clearHistory();
                    setHistory([]);
                  }}
                />
              </motion.div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 text-red-400 text-sm"
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <button
                type="button"
                onClick={analyze}
                disabled={loading || !file || !jobDescription}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-glow hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Analyze resume
              </button>
            </motion.div>

            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 glass rounded-2xl border border-slate-700/50"
                >
                  <Loader />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {showConfetti && (
              <Confetti
                width={typeof window !== 'undefined' ? window.innerWidth : 800}
                height={typeof window !== 'undefined' ? window.innerHeight : 600}
                recycle={false}
                numberOfPieces={300}
                onConfettiComplete={() => setShowConfetti(false)}
              />
            )}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/analyze"
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                onClick={handleReanalyze}
              >
                <ArrowLeft className="w-4 h-4" />
                New analysis
              </Link>
              <button
                type="button"
                onClick={handleSaveReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-200 text-sm font-medium border border-slate-600 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Save report as PDF
              </button>
            </div>
            <ScoreCard
              result={result}
              onReanalyze={handleReanalyze}
              showConfetti={showConfetti}
            />
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-2">
                <HeatmapView result={result} />
              </div>
              <div className="md:col-span-3">
                <SuggestionsPanel result={result} onCopySummary={handleCopySummary} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
