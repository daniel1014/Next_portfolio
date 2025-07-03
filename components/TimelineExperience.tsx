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
  return (
    <div className="relative">
      {/* Timeline line */}
      <motion.div
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"
      />
      
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.3,
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
                duration: 0.5, 
                delay: index * 0.3 + 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-gray-900 z-10"
            />
            
            {/* Experience card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="ml-20 bg-card-gradient backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 w-full hover:shadow-blue-500/20 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 + 0.7, duration: 0.5 }}
                  className="text-2xl font-semibold text-blue-400"
                >
                  {exp.title}
                </motion.h3>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.3 + 0.8, duration: 0.5 }}
                className="flex flex-wrap gap-4 mb-6 text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{exp.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{exp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{exp.period}</span>
                </div>
              </motion.div>
              
              <motion.ul 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.3 + 1, duration: 0.5 }}
                className="space-y-3"
              >
                {exp.description.map((item, itemIndex) => (
                  <motion.li 
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.3 + 1.1 + itemIndex * 0.1, 
                      duration: 0.4 
                    }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
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