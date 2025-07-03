'use client';
import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: React.ReactNode;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  duration = 2, 
  suffix = '', 
  prefix = '', 
  label,
  icon 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 backdrop-blur-sm"
    >
      {icon && (
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-blue-500/20 rounded-full">
            {icon}
          </div>
        </div>
      )}
      <motion.div 
        className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
        animate={{ scale: isInView ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {prefix}{count}{suffix}
      </motion.div>
      <div className="text-gray-100 text-sm font-medium drop-shadow-md">{label}</div>
    </motion.div>
  );
};

export default AnimatedCounter;