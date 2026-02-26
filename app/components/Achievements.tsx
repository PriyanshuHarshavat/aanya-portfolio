'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Users,
  Heart,
  Star,
  Lightbulb,
  Library,
  LucideIcon
} from 'lucide-react';
import { achievements } from '@/lib/content';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Award,
  Users,
  Heart,
  Star,
  Lightbulb,
  Library,
};

const colorClasses = {
  primary: {
    bg: 'bg-gradient-to-br from-primary/10 to-purple-500/10',
    icon: 'text-primary',
    border: 'border-primary/20',
  },
  accent: {
    bg: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
    icon: 'text-pink-500',
    border: 'border-pink-500/20',
  },
  highlight: {
    bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
};

const sizeClasses = {
  large: 'bento-large',
  medium: 'bento-medium',
  small: 'bento-small',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            What I've Accomplished
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Achievements & <span className="gradient-text">Highlights</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            A snapshot of my journey so far—from academics to leadership to making an impact.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="bento-grid"
        >
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Star;
            const colors = colorClasses[achievement.color];
            const size = sizeClasses[achievement.size || 'small'];

            return (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                className={cn(
                  'relative group rounded-2xl border p-6 md:p-8 overflow-hidden card-hover card-glow',
                  colors.bg,
                  colors.border,
                  size
                )}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-10">
                  <Icon className="w-full h-full" />
                </div>

                <div className="relative z-10">
                  <motion.div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                      'bg-white dark:bg-white/10 shadow-lg',
                      colors.icon
                    )}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>

                  <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground">
                    {achievement.title}
                  </h3>

                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
