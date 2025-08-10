'use client';
import React from 'react';
import { motion } from 'framer-motion';

const AuroraDivider: React.FC = () => {
  return (
    <div className="relative w-full h-12 sm:h-14 my-10 sm:my-16 pointer-events-none" aria-hidden>
      {/* Subtle wide glow */}
      <motion.div
        className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-10 sm:h-12 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-3xl rounded-full"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Hairline base */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent z-0" />

      {/* Moving sheen across the entire line */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-[2px] w-48 sm:w-64 bg-gradient-to-r from-transparent via-white/80 to-transparent mix-blend-screen z-10"
        initial={{ left: '-15%' }}
        animate={{ left: '115%' }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Traveling particles (aligned with the line) */}
      {/* <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.45)] z-10"
        initial={{ left: '-10%' }}
        animate={{ left: '110%', y: [0, -1, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      /> */}
    </div>
  );
};

export default AuroraDivider;