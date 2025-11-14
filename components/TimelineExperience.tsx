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
  // Optimized animation timing with proper stagger
  const easeOutExpo = [0.16, 1, 0.3, 1];

  const timelineLineDuration = 0.8;
  const cardDuration = 0.6;
  const cardStagger = 0.5;
  const contentStagger = 0.08;
  const contentDuration = 0.5;
  const liStagger = 0.06;

  return (
    <motion.div
      className="relative px-4 sm:px-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1
          }
        }
      }}
    >
      {/* Timeline line */}
      <motion.div
        variants={{
          hidden: { height: 0 },
          visible: { height: "100%" }
        }}
        transition={{ duration: timelineLineDuration, ease: easeOutExpo }}
        className="absolute left-4 sm:left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"
      />

      <motion.div
        className="space-y-8 sm:space-y-12"
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: 0.3,
              staggerChildren: cardStagger
            }
          }
        }}
      >
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, x: -100 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: cardDuration,
                  ease: easeOutExpo,
                  staggerChildren: contentStagger,
                  delayChildren: 0.15
                }
              }
            }}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <motion.div
              variants={{
                hidden: { scale: 0 },
                visible: {
                  scale: [0, 1.3, 1],
                  transition: {
                    duration: 0.5,
                    ease: easeOutExpo,
                    times: [0, 0.6, 1]
                  }
                }
              }}
              className="absolute left-2 sm:left-6 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 sm:border-4 border-gray-900 z-10"
            />

            {/* Experience card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
              className="ml-8 sm:ml-20 bg-card-gradient backdrop-blur-lg border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 w-full hover:shadow-blue-500/20 transition-all duration-500"
            >
              <motion.div
                className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: contentDuration,
                      ease: easeOutExpo
                    }
                  }
                }}
              >
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-400">
                  {exp.title}
                </h3>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: contentDuration,
                      ease: easeOutExpo
                    }
                  }
                }}
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
                className="space-y-2 sm:space-y-3"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: liStagger
                    }
                  }
                }}
              >
                {exp.description.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: contentDuration,
                          ease: easeOutExpo
                        }
                      }
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
      </motion.div>
    </motion.div>
  );
};

export default TimelineExperience;