'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { heroContent, siteContent } from '@/lib/content';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-12 md:pt-20">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="blob blob-primary w-[500px] h-[500px] -top-20 -right-20"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="blob blob-accent w-[400px] h-[400px] top-1/2 -left-40"
          animate={{
            x: [0, 30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="blob blob-mint w-[300px] h-[300px] bottom-20 right-1/4"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 md:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-3 md:gap-12 lg:gap-20">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin-slow opacity-20 blur-xl" />

              {/* Photo container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-2xl animate-pulse-glow">
                {heroContent.image ? (
                  <Image
                    src={heroContent.image}
                    alt={siteContent.name}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                ) : (
                  <div className="w-full h-full image-placeholder flex-col">
                    <Sparkles className="w-16 h-16 mb-2" />
                    <span className="text-sm">Upload headshot</span>
                  </div>
                )}
              </div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              >
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium shadow-lg">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full mr-1.5 md:mr-2 animate-pulse" />
                  {heroContent.badge}
                </Badge>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center lg:text-left order-2 lg:order-1 max-w-2xl"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 leading-tight">
              <span className="gradient-text">{siteContent.name}</span>
            </h1>

            <h2 className="font-display text-lg md:text-3xl lg:text-4xl font-semibold text-foreground mb-4 md:mb-6">
              {heroContent.headline}{' '}
              <span className="gradient-text-accent">{heroContent.headlineAccent}</span>
            </h2>

            <p className="text-sm md:text-xl text-muted-foreground mb-4 md:mb-8 leading-relaxed">
              {heroContent.subheadline}
            </p>

            <div className="flex flex-row gap-4 justify-center lg:justify-start">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold px-6 py-5 md:px-8 md:py-6 text-base md:text-lg shadow-lg"
                  asChild
                >
                  <a href="#contact">{heroContent.cta}</a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden md:block">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 px-8 py-6 text-lg"
                  asChild
                >
                  <a href="#book">Read My Book</a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <motion.a
            href="#about"
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ArrowDown size={20} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
