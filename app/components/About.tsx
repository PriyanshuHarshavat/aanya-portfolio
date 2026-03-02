'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import {
  aboutContent as defaultAboutContent,
  siteContent as defaultSiteContent,
  type SiteContent,
} from '@/lib/content';
import Image from 'next/image';

interface AboutContentType {
  title: string;
  bio: string[];
  image: string;
  imageAlt?: string;
  highlights: { label: string; value: string }[];
}

interface AboutProps {
  siteContent?: SiteContent;
  aboutContent?: AboutContentType;
}

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function About({
  siteContent = defaultSiteContent,
  aboutContent = defaultAboutContent,
}: AboutProps) {
  return (
    <section id="about" className="py-24 md:py-32 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Image */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {aboutContent.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={aboutContent.image}
                  alt={aboutContent.imageAlt || `${siteContent.name} - About`}
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full h-full image-placeholder flex-col">
                  <Quote className="w-16 h-16 mb-2" />
                  <span className="text-sm">Upload about photo</span>
                </div>
              )}

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 glass p-6 rounded-2xl max-w-xs shadow-xl hidden md:block"
            >
              <Quote className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm italic text-foreground">
                "Young people have the power to create meaningful change—and I'm committed to being part of that change."
              </p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants}>
            <motion.span
              variants={itemVariants}
              className="text-primary font-semibold text-sm uppercase tracking-wider"
            >
              Get to know me
            </motion.span>

            <motion.h2
              variants={itemVariants}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6"
            >
              {aboutContent.title}
            </motion.h2>

            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {aboutContent.bio.map((paragraph, index) => (
                <motion.p key={index} variants={itemVariants}>
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Highlights Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
            >
              {aboutContent.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="glass rounded-xl p-4 text-center card-hover"
                >
                  <p className="font-display text-2xl md:text-3xl font-bold gradient-text">
                    {highlight.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {highlight.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
