'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, GraduationCap, Calendar, Clock, Target, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResearchExperience } from '@/lib/content';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experiences: ResearchExperience[];
}

export default function ResearchExperienceModal({ isOpen, onClose, experiences }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToNext = useCallback(() => {
    if (currentIndex < experiences.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, experiences.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  const experience = experiences[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 p-4 md:p-8">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-white" />
              </button>

              <div className="flex items-center gap-3 md:gap-4">
                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25"
                >
                  <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </motion.div>
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white"
                  >
                    Research Experience
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-base text-slate-500 dark:text-slate-400"
                  >
                    Hands-on learning at top institutions
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Experience Carousel */}
            <div className="p-4 md:p-8 relative">
              {/* Navigation Arrows */}
              {experiences.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                      currentIndex === 0
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white shadow-lg hover:scale-110 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={currentIndex === experiences.length - 1}
                    className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                      currentIndex === experiences.length - 1
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white shadow-lg hover:scale-110 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </>
              )}

              {/* Experience Content with Animation */}
              <div className="mx-8 md:mx-16 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/50 overflow-hidden"
                  >
                    {/* Experience Header */}
                    <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-cyan-500/20 p-4 md:p-6 border-b border-slate-200 dark:border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                            {experience.institution}
                          </h3>
                          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm md:text-base">
                            {experience.department}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {experience.period}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {experience.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="p-4 md:p-6 space-y-5">
                      {/* Project Title */}
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-slate-800 dark:text-white mb-2">
                          {experience.projectTitle}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                          {experience.description}
                        </p>
                      </div>

                      {/* Outcomes */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-emerald-500" />
                          <h5 className="font-semibold text-slate-800 dark:text-white text-sm md:text-base">
                            Key Outcomes
                          </h5>
                        </div>
                        <ul className="space-y-2">
                          {experience.outcomes.map((outcome, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Skills */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <h5 className="font-semibold text-slate-800 dark:text-white text-sm md:text-base">
                            Skills Developed
                          </h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {experience.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dot Indicators */}
              {experiences.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {experiences.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToIndex(index)}
                      className={`transition-all duration-300 ${
                        index === currentIndex
                          ? 'w-8 h-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full'
                          : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 rounded-full hover:bg-slate-400 dark:hover:bg-slate-500'
                      }`}
                      aria-label={`Go to experience ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Experience Counter */}
              {experiences.length > 1 && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3">
                  {currentIndex + 1} of {experiences.length}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
