'use client';
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const Section: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, children, id }) => {
  // Calculate dynamic width based on title length and character width
  const getUnderlineWidth = () => {
    const baseCharWidth = 25; // Approximate width per character in pixels
    const minWidth = 100; // Minimum width in pixels
    const maxWidth = 400; // Maximum width in pixels
    const calculatedWidth = title.length * baseCharWidth;
    
    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
  };

  return (
    <div className="mb-32" id={id}>
      <AnimatedSection className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold mb-4 text-gray-200"
        >
          {title}
        </motion.h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: getUnderlineWidth() }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="h-1 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
        />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        {children}
      </AnimatedSection>
    </div>
  );
};

export default Section;