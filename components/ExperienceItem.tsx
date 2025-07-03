'use client';
import React from 'react';
import { motion } from 'framer-motion';

const ExperienceItem: React.FC<{ title: string; company: string; location: string; period: string; description: string[] }> = ({ title, company, location, period, description }) => (
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ scale: 1.02, y: -5 }}
    className="bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 hover:shadow-blue-500/20 transition-all duration-500"
  >
    <motion.h3 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="text-2xl font-semibold text-blue-400 mb-2"
    >
      {title}
    </motion.h3>
    <motion.p 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="text-lg text-gray-400 mb-4"
    >
      {company} | {location} | {period}
    </motion.p>
    <motion.ul 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="list-disc list-inside text-gray-300 space-y-2"
    >
      {description.map((item, index) => (
        <motion.li 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  </motion.div>
);

export default ExperienceItem;