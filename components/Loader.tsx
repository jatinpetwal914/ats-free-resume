'use client';

import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-pulse" />
      </motion.div>
      <motion.p
        className="text-slate-400 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Analyzing your resume...
      </motion.p>
      <motion.div
        className="h-1 w-48 rounded-full bg-slate-800 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: ['0%', '70%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
