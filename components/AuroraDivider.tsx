'use client';
import React from 'react';
import { motion } from 'framer-motion';

const AuroraDivider: React.FC = () => {
  return (
    <div className="relative w-full h-24 flex items-center justify-center my-16">
      {/* Main aurora line */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: '100%', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
      />
      
      {/* Glowing aurora effects */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-sm"
      />
      
      {/* Center aurora burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1, type: "spring", stiffness: 200 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg shadow-blue-500/50"
      />
      
      {/* Side aurora particles */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.8 }}
        animate={{
          y: [0, -5, 0],
          opacity: [0.5, 1, 0.5],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="absolute left-1/4 w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full shadow-sm shadow-emerald-400/50"
      />
      
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.8 }}
        animate={{
          y: [0, 5, 0],
          opacity: [0.5, 1, 0.5],
          transition: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="absolute right-1/4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-sm shadow-purple-400/50"
      />
    </div>
  );
};

export default AuroraDivider;