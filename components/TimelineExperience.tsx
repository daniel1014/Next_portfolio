'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

interface ExperienceData {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
}

interface TimelineExperienceProps {
  experiences: ExperienceData[];
}

const TimelineExperience: React.FC<TimelineExperienceProps> = ({ experiences }) => {
  // Animation timing constants for easy adjustment and DRYness
  const timelineLineDuration = 1.2; // was 2
  const cardDuration = 0.6; // was 0.8
  const cardDelayStep = 0.22; // was 0.3
  const dotDuration = 0.35; // was 0.5
  const dotDelayOffset = 0.35; // was 0.5
  const titleDelayOffset = 0.5; // was 0.7
  const titleDuration = 0.35; // was 0.5
  const metaDelayOffset = 0.58; // was 0.8
  const metaDuration = 0.35; // was 0.5
  const descDelayOffset = 0.7; // was 1
  const descDuration = 0.35; // was 0.5
  const liDelayOffset = 0.8; // was 1.1
  const liDuration = 0.28; // was 0.4
  const liStep = 0.07; // was 0.1

  return (
    <div className="relative px-4 sm:px-0">
      {/* Timeline line */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: timelineLineDuration, ease: "easeOut" }}
        className="absolute left-4 sm:left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"
      />
      
      <div className="space-y-8 sm:space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: cardDuration, 
              delay: index * cardDelayStep,
              ease: "easeOut" 
            }}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: dotDuration, 
                delay: index * cardDelayStep + dotDelayOffset,
                type: "spring",
                stiffness: 200
              }}
              className="absolute left-2 sm:left-6 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 sm:border-4 border-gray-900 z-10"
            />
            
            {/* Experience card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="ml-8 sm:ml-20 bg-card-gradient backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 w-full hover:shadow-blue-500/20 transition-all duration-500"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * cardDelayStep + titleDelayOffset, duration: titleDuration }}
                  className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-400"
                >
                  {exp.title}
                </motion.h3>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * cardDelayStep + metaDelayOffset, duration: metaDuration }}
                className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6 text-gray-400 text-sm sm:text-base"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{exp.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{exp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{exp.period}</span>
                </div>
              </motion.div>
              
              <motion.ul 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * cardDelayStep + descDelayOffset, duration: descDuration }}
                className="space-y-2 sm:space-y-3"
              >
                {exp.description.map((item, itemIndex) => (
                  <motion.li 
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * cardDelayStep + liDelayOffset + itemIndex * liStep, 
                      duration: liDuration 
                    }}
                    className="flex items-start gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base leading-relaxed"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineExperience;