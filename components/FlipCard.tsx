'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Info, Download } from 'lucide-react';
import Image from 'next/image';

interface ProjectData {
  title: string;
  period: string;
  images: string[];
  frontDescription: string;
  backDetails: Array<{
    title: string;
    description: string;
  }>;
  technologies?: string[];
  links?: {
    github?: string;
    demo?: string;
    sampleData?: string;
  };
}

interface FlipCardProps {
  project: ProjectData;
}

// Local, mobile-first gallery for this card
const CardGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isAuto, setIsAuto] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate every 4.5s when not paused
  useEffect(() => {
    if (isAuto && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isAuto, images.length]);

  return (
    <div
      className="relative w-full h-64 sm:h-80 md:h-[28rem] mb-4"
      onMouseEnter={() => setIsAuto(false)}
      onMouseLeave={() => setIsAuto(true)}
      onTouchStart={() => setIsAuto(false)}
      onTouchEnd={() => setIsAuto(true)}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ opacity: i === index ? 1 : 0, transition: 'opacity .4s ease' }}
        >
          <Image src={src} alt={`Project image ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 768px" className="object-contain rounded-2xl" />
        </div>
      ))}
      <button aria-label="Previous" onClick={(e)=>{e.stopPropagation();setIsAuto(false);setIndex((p)=> (p-1+images.length)%images.length);}} className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900/60 text-white p-2 rounded-full">‹</button>
      <button aria-label="Next" onClick={(e)=>{e.stopPropagation();setIsAuto(false);setIndex((p)=> (p+1)%images.length);}} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900/60 text-white p-2 rounded-full">›</button>
    </div>
  );
};

/**
 * FlipCard component
 * - The icon size for action buttons (Demo, GitHub, Sample Data) is reduced for better alignment on mobile.
 * - Responsive gap and flex-wrap ensure horizontal alignment on mobile.
 */
const FlipCard: React.FC<FlipCardProps> = ({ project }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-[700px] sm:h-[660px] w-full perspective-1000 z-0" style={{ transformStyle: 'preserve-3d' }}>
      <motion.div
        className="relative w-full h-full duration-700 transform-style-preserve-3d cursor-pointer"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <motion.div 
          className="absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-8 bg-white/10 border border-white/15 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{ 
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="flex justify-between items-start mb-2 sm:mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">{project.title}</h3>
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-white/10 rounded-lg border border-white/10"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </motion.div>
          </div>
          
          <p className="text-gray-300 mb-3 sm:mb-4">{project.period}</p>
          
          <CardGallery images={project.images} />
          
          <p className="text-gray-200 leading-relaxed mb-4">
            {project.frontDescription}
          </p>
          
          {/* Bottom area pinned at card bottom */}
          <div className="mt-auto space-y-3 pt-3">
            {project.technologies && (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-xs sm:text-sm text-cyan-200 bg-white/10 border border-white/10 backdrop-blur-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {project.links && (
              // Responsive flex-row for horizontal alignment, smaller icons for mobile
              <div className="flex flex-row flex-wrap gap-2 sm:gap-3">
                {project.links.demo && (
                  <motion.a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl border-2 border-blue-300 shadow-lg font-semibold hover:from-blue-600 hover:to-pink-600 hover:shadow-xl transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">Demo</span>
                  </motion.a>
                )}
                {project.links.github && (
                  <motion.a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/10 hover:bg-white/15 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">GitHub</span>
                  </motion.a>
                )}
                {project.links.sampleData && (
                  <motion.a
                    href={project.links.sampleData}
                    download
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-200 rounded-lg border border-emerald-400/20 hover:bg-emerald-500/30 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">Sample Data</span>
                  </motion.a>
                )}
              </div>
            )}

            <div className="flex justify-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-cyan-300 text-xs sm:text-sm"
              >
                Click to flip for details →
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div 
          className="absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-8 bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col min-h-[340px] sm:min-h-[400px] overflow-auto"
          initial={{ rotateX: 180 }}
          animate={{ rotateX: 180 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{ 
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">{project.title}</h3>
            <motion.div
              whileHover={{ rotate: -180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-white/10 rounded-lg border border-white/10"
            >
              <Info className="w-5 h-5 text-purple-300" />
            </motion.div>
          </div>
          
          <div className="space-y-6 mb-6">
            {project.backDetails.map((detail, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-purple-200 mb-2">{detail.title}</h4>
                <p className="text-gray-200 leading-relaxed">{detail.description}</p>
              </motion.div>
            ))}
          </div>
          
          {project.links && (
            // Responsive flex-row for horizontal alignment, smaller icons for mobile
            <div className="flex flex-row flex-wrap gap-2 sm:gap-3 mb-4">
              {project.links.demo && (
                <motion.a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl border-2 border-blue-300 shadow-lg font-semibold hover:from-blue-600 hover:to-pink-600 hover:shadow-xl transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Demo</span>
                </motion.a>
              )}              
              {project.links.github && (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white/10 text-gray-200 rounded-lg border border-white/10 hover:bg-white/15 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">GitHub</span>
                </motion.a>
              )}
              {project.links.sampleData && (
                <motion.a
                  href={project.links.sampleData}
                  download
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-emerald-500/20 text-emerald-200 rounded-lg border border-emerald-400/20 hover:bg-emerald-500/30 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Sample Data</span>
                </motion.a>
              )}
            </div>
          )}
          
          {/* 
            Pin the "Click to flip back" at the bottom using flex-grow and flex-col.
            This ensures the message always stays at the bottom regardless of content height.
          */}
          <div className="flex-grow" />
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-purple-300 text-xs sm:text-sm"
            >
              ← Click to flip back
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlipCard;