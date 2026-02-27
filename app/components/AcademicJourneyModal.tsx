'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, BookOpen, FlaskConical, Globe, Code, Languages, Palette, Trophy } from 'lucide-react';
import { AcademicJourney } from '@/lib/content';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  journey: AcademicJourney;
}

const subjectIcons: Record<string, React.ElementType> = {
  English: BookOpen,
  Math: Trophy,
  Science: FlaskConical,
  'Social Studies': Globe,
  Technology: Code,
  Language: Languages,
  Arts: Palette,
};

const typeStyles = {
  AP: {
    bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
    border: 'border-amber-400/50',
    glow: 'shadow-amber-500/25',
    badge: 'bg-amber-500',
  },
  Honors: {
    bg: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500',
    border: 'border-violet-400/50',
    glow: 'shadow-violet-500/25',
    badge: 'bg-violet-500',
  },
  Core: {
    bg: 'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700',
    border: 'border-slate-400/50',
    glow: 'shadow-slate-500/25',
    badge: 'bg-slate-500',
  },
};

export default function AcademicJourneyModal({ isOpen, onClose, journey }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl"
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
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-accent flex items-center justify-center shadow-lg shadow-primary/25"
                >
                  <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </motion.div>
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white"
                  >
                    Academic Journey
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-base text-slate-500 dark:text-slate-400"
                  >
                    Currently: <span className="text-primary font-semibold">{journey.currentYear}</span>
                  </motion.p>
                </div>
              </div>

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2 md:gap-4 mt-4 md:mt-6"
              >
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                  <span className="text-emerald-500 font-bold text-sm md:text-lg">{journey.gpa}</span>
                  <span className="text-emerald-600/70 text-xs md:text-sm">GPA</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <span className="text-amber-500 font-bold text-sm md:text-lg">
                    {journey.years.reduce((acc, y) => acc + y.courses.filter(c => c.type === 'AP').length, 0)}
                  </span>
                  <span className="text-amber-600/70 text-xs md:text-sm">AP</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                  <span className="text-violet-500 font-bold text-sm md:text-lg">
                    {journey.years.reduce((acc, y) => acc + y.courses.filter(c => c.type === 'Honors').length, 0)}
                  </span>
                  <span className="text-violet-600/70 text-xs md:text-sm">Honors</span>
                </div>
              </motion.div>
            </div>

            {/* Timeline Content */}
            <div className="p-4 md:p-8">
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-accent" />

                {journey.years.map((academicYear, yearIndex) => (
                  <motion.div
                    key={academicYear.year}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + yearIndex * 0.2 }}
                    className="relative pl-12 md:pl-16 pb-8 md:pb-12 last:pb-0"
                  >
                    {/* Timeline Node */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + yearIndex * 0.2, type: 'spring' }}
                      className={`absolute left-1.5 md:left-3 w-6 h-6 md:w-7 md:h-7 rounded-full border-4 border-white dark:border-slate-900 ${
                        academicYear.year === journey.currentYear
                          ? 'bg-gradient-to-r from-primary to-accent animate-pulse'
                          : 'bg-gradient-to-r from-slate-400 to-slate-500'
                      }`}
                    />

                    {/* Year Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {academicYear.year}
                        {academicYear.year === journey.currentYear && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                            Current
                          </span>
                        )}
                      </h3>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">{academicYear.semester}</p>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {academicYear.courses.map((course, courseIndex) => {
                        const IconComponent = subjectIcons[course.subject] || BookOpen;
                        const styles = typeStyles[course.type];

                        return (
                          <motion.div
                            key={course.name}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.8 + yearIndex * 0.2 + courseIndex * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className={`relative overflow-hidden rounded-xl border ${styles.border} bg-white dark:bg-slate-800/50 shadow-sm p-4 cursor-default group`}
                          >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${styles.bg}`} />

                            <div className="relative flex items-start gap-3">
                              {/* Subject Icon */}
                              <div className={`w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center shadow-lg ${styles.glow} flex-shrink-0`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-slate-800 dark:text-white font-medium text-sm leading-tight truncate">
                                  {course.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles.badge} text-white`}>
                                    {course.type}
                                  </span>
                                  <span className="text-slate-400 dark:text-slate-500 text-xs">{course.subject}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 p-4 md:p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95">
              <div className="flex justify-center gap-4 md:gap-6 text-[10px] md:text-xs text-slate-500 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-amber-500 to-red-500" />
                  <span>AP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
                  <span>Honors</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-slate-500 to-slate-600" />
                  <span>Core</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
