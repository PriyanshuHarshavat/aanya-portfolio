'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function BookPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const iframe = document.getElementById('flipbook-iframe') as HTMLIFrameElement;
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass-strong border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <a href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </a>
            </Button>

            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h1 className="font-display font-bold text-lg md:text-xl">
                Annie and Froggy Make a Friend
              </h1>
            </div>

            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Flipbook Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900"
        >
          <iframe
            id="flipbook-iframe"
            src="/flipbook/index.html"
            className="w-full border-0"
            style={{ height: '80vh', minHeight: '500px' }}
            allowFullScreen
            title="Annie and Froggy Make a Friend - Flipbook"
          />
        </motion.div>

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground text-sm mt-6"
        >
          Click and drag to flip pages, or use the navigation arrows
        </motion.p>
      </main>
    </div>
  );
}
