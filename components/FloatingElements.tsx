'use client';
import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating geometric shapes */}
      {/* Aurora-themed geometric shapes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded transform shadow-lg shadow-blue-500/10"
      />
      
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [360, 180, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-full shadow-lg shadow-purple-500/10"
      />
      
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
          rotate: [0, 45, 90],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-gradient-to-tr from-blue-400/25 to-emerald-500/25 transform rotate-45 shadow-lg shadow-blue-400/10"
      />
      
      <motion.div
        animate={{
          y: [0, 25, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-2/3 right-1/3 w-5 h-5 border-2 border-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full shadow-lg shadow-purple-400/10"
      />
      
      {/* Additional aurora particles */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/6 w-2 h-2 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 rounded-full shadow-lg shadow-emerald-500/10"
      />
      
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/3 right-1/6 w-3 h-3 bg-gradient-to-bl from-pink-500/20 to-purple-500/20 rounded-full shadow-lg shadow-pink-500/10"
      />
    </div>
  );
};

export default FloatingElements;