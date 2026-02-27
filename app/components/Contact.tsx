'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteContent } from '@/lib/content';

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5" />

      {/* Animated blobs */}
      <motion.div
        className="blob blob-primary w-[400px] h-[400px] top-0 right-0"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="blob blob-accent w-[300px] h-[300px] bottom-0 left-0"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-sm uppercase tracking-wider"
          >
            Get in Touch
          </motion.span>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether you're interested in collaborating, have questions about my work,
            or just want to say hello—I'd love to hear from you.
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold px-10 py-7 text-lg shadow-xl group"
              asChild
            >
              <a href={`mailto:${siteContent.email}`}>
                <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                Send Me an Email
                <ArrowRight className="w-5 h-5 ml-3 opacity-0 group-hover:opacity-100 -mr-2 group-hover:mr-0 transition-all" />
              </a>
            </Button>
          </motion.div>

          {/* Social Links */}
          {(siteContent.linkedin || siteContent.github) && (
            <div className="flex justify-center gap-4">
              {siteContent.linkedin && (
                <motion.a
                  href={siteContent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full glass hover:bg-primary/10 transition-colors group"
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              )}

              {siteContent.github && (
                <motion.a
                  href={siteContent.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full glass hover:bg-primary/10 transition-colors group"
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
