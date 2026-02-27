'use client';

import { motion } from 'framer-motion';
import { siteContent, footerContent } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo/Name */}
          <motion.a
            href="#"
            className="font-display font-bold text-xl"
            whileHover={{ scale: 1.02 }}
          >
            <span className="gradient-text">{siteContent.name}</span>
          </motion.a>

          {/* Quick Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerContent.quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
