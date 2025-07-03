'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Info } from 'lucide-react';
import ProjectGallery from './ProjectGallery';

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
  };
}

interface FlipCardProps {
  project: ProjectData;
}

const FlipCard: React.FC<FlipCardProps> = ({ project }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative h-[600px] w-full perspective-1000 z-10" style={{ transformStyle: 'preserve-3d' }}>
      <motion.div
        className="relative w-full h-full duration-700 transform-style-preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{ 
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-semibold text-blue-400">{project.title}</h3>
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-blue-500/20 rounded-lg"
            >
              <Info className="w-5 h-5 text-blue-400" />
            </motion.div>
          </div>
          
          <p className="text-gray-300 mb-6">{project.period}</p>
          
          <div className="mb-6">
            <ProjectGallery images={project.images} />
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            {project.frontDescription}
          </p>
          
          {project.technologies && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-blue-400 text-sm"
            >
              Click to flip for details →
            </motion.div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-lg border border-purple-400/20 rounded-2xl shadow-2xl p-8"
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 180 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{ 
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-blue-400">{project.title}</h3>
            <motion.div
              whileHover={{ rotate: -180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-purple-500/20 rounded-lg"
            >
              <Info className="w-5 h-5 text-purple-400" />
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
                <h4 className="text-xl font-semibold text-purple-300 mb-2">{detail.title}</h4>
                <p className="text-gray-300 leading-relaxed">{detail.description}</p>
              </motion.div>
            ))}
          </div>
          
          {project.links && (
            <div className="flex gap-4 mb-4">
              {project.links.github && (
                <motion.a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </motion.a>
              )}
              {project.links.demo && (
                <motion.a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Demo
                </motion.a>
              )}
            </div>
          )}
          
          <div className="flex justify-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-purple-400 text-sm"
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