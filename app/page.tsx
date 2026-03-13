'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import BackgroundBlobs from '@/components/BackgroundBlobs';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <BackgroundBlobs />
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="text-cyan-400/90 text-sm font-medium tracking-widest uppercase mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Tech Excellence
        </motion.p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Resume Analyser
          </span>
          <br />
          <span className="text-slate-200">(Is Your Resume Perfect !! ?)</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Get your resume past applicant tracking systems. AI-powered analysis,
          keyword matching, and actionable improvements.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300 font-semibold hover:shadow-glow hover:border-cyan-400/60 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            Analyze resume
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href="/analyze"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-glow hover:scale-110 transition-transform"
          aria-label="Analyze"
        >
          <span className="text-2xl font-light">+</span>
        </Link>
      </motion.div>
    </main>
  );
}
