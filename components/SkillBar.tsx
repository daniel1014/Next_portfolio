'use client';
import React from 'react';
import { motion } from 'framer-motion';

const SkillBar: React.FC<{ skill: string; level: number }> = ({ skill, level }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-6"
  >
    <div className="flex justify-between mb-2">
      <span className="text-lg font-medium text-gray-300">{skill}</span>
      <motion.span 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="text-sm font-medium text-blue-400"
      >
        {level}%
      </motion.span>
    </div>
    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full shadow-lg"
      />
    </div>
  </motion.div>
);

export default SkillBar;