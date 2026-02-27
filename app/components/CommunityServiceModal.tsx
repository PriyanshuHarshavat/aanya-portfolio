'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Heart, Clock, Calendar, GraduationCap, Users,
  BookOpen, Package, ShoppingBag, Book, Utensils,
  LucideIcon
} from 'lucide-react';
import { CommunityService } from '@/lib/content';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  service: CommunityService;
}

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Heart,
  Users,
  BookOpen,
  Package,
  ShoppingBag,
  Book,
  Utensils,
};

const colorStyles: Record<string, { bg: string; border: string; text: string; light: string }> = {
  blue: {
    bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    border: 'border-blue-500/30',
    text: 'text-blue-500',
    light: 'bg-blue-500/10',
  },
  orange: {
    bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
    border: 'border-orange-500/30',
    text: 'text-orange-500',
    light: 'bg-orange-500/10',
  },
  purple: {
    bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
    border: 'border-purple-500/30',
    text: 'text-purple-500',
    light: 'bg-purple-500/10',
  },
  green: {
    bg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    border: 'border-emerald-500/30',
    text: 'text-emerald-500',
    light: 'bg-emerald-500/10',
  },
};

export default function CommunityServiceModal({ isOpen, onClose, service }: Props) {
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
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex items-center justify-center shadow-lg shadow-pink-500/25"
                >
                  <Heart className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </motion.div>
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white"
                  >
                    Community Service
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm md:text-base text-slate-500 dark:text-slate-400"
                  >
                    Making a difference, one hour at a time
                  </motion.p>
                </div>
              </div>

              {/* Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 md:gap-4 mt-4 md:mt-6"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30">
                  <Clock className="w-4 h-4 text-pink-500" />
                  <span className="text-pink-500 font-bold text-sm md:text-lg">{service.totalHours}</span>
                  <span className="text-pink-600/70 text-xs md:text-sm">Hours</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-purple-500 font-bold text-sm md:text-lg">{service.yearsActive}</span>
                  <span className="text-purple-600/70 text-xs md:text-sm">Years Active</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500 font-bold text-sm md:text-lg">{service.categories.reduce((acc, cat) => acc + cat.organizations.length, 0)}</span>
                  <span className="text-blue-600/70 text-xs md:text-sm">Organizations</span>
                </div>
              </motion.div>
            </div>

            {/* Categories */}
            <div className="p-4 md:p-8 space-y-6">
              {service.categories.map((category, catIndex) => {
                const CategoryIcon = iconMap[category.icon] || Heart;
                const colors = colorStyles[category.color] || colorStyles.purple;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + catIndex * 0.1 }}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shadow-lg`}>
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                        {category.name}
                      </h3>
                    </div>

                    {/* Organizations */}
                    <div className="space-y-3 pl-2">
                      {category.organizations.map((org, orgIndex) => {
                        const OrgIcon = iconMap[org.icon] || Heart;

                        return (
                          <motion.div
                            key={org.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + catIndex * 0.1 + orgIndex * 0.05 }}
                            className={`rounded-xl border ${colors.border} bg-white dark:bg-slate-800/50 p-4 md:p-5`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center flex-shrink-0`}>
                                <OrgIcon className={`w-5 h-5 ${colors.text}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                  <h4 className="font-semibold text-slate-800 dark:text-white">
                                    {org.name}
                                  </h4>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {org.period}
                                  </span>
                                </div>
                                <p className={`text-sm font-medium ${colors.text} mb-2`}>
                                  {org.role}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {org.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
