'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  Brain,
  Trophy,
  Calendar,
  ArrowUpRight,
  BookOpen,
  Award,
  LucideIcon
} from 'lucide-react';
import { activities } from '@/lib/content';

const iconMap: Record<string, LucideIcon> = {
  Users,
  Heart,
  Brain,
  Trophy,
  BookOpen,
  Award,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Activities() {
  return (
    <section id="activities" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Beyond the Classroom
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Activities & <span className="gradient-text">Involvement</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            The clubs, organizations, and causes that shape who I am.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          {activities.map((activity, index) => {
            const Icon = iconMap[activity.icon] || Users;

            return (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="group relative glass rounded-2xl p-6 md:p-8 overflow-hidden card-hover"
              >
                {/* Background number */}
                <span className="absolute -bottom-4 -right-4 font-display text-[120px] font-bold text-primary/5 dark:text-primary/10 leading-none pointer-events-none">
                  {(index + 1).toString().padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg"
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>

                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowUpRight className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold mb-1 text-foreground">
                    {activity.name}
                  </h3>

                  <p className="text-primary font-semibold text-sm mb-3">
                    {activity.role}
                  </p>

                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                    {activity.description}
                  </p>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {activity.years}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
