'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, X } from 'lucide-react';

export default function ViewportToggle() {
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Lock body scroll when preview is open
  useEffect(() => {
    if (showMobilePreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobilePreview]);

  return (
    <>
      {/* Toggle Button - Always visible at bottom */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 bg-slate-900 text-white rounded-full px-2 py-2 shadow-2xl border border-slate-700"
      >
        <button
          onClick={() => setShowMobilePreview(true)}
          className={`p-3 rounded-full transition-all ${
            showMobilePreview
              ? 'bg-indigo-500 text-white'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="Preview mobile"
        >
          <Smartphone size={20} />
        </button>

        <button
          onClick={() => setShowMobilePreview(false)}
          className={`p-3 rounded-full transition-all ${
            !showMobilePreview
              ? 'bg-indigo-500 text-white'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title="Desktop view"
        >
          <Monitor size={20} />
        </button>
      </motion.div>

      {/* Mobile Preview Overlay */}
      <AnimatePresence>
        {showMobilePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-slate-900/95 flex items-center justify-center p-4 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowMobilePreview(false);
              }
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute top-6 right-6 p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Device label */}
            <div className="absolute top-6 left-6 text-white">
              <p className="text-lg font-semibold">Mobile Preview</p>
              <p className="text-sm text-slate-400">iPhone 14 Pro - Scroll inside phone</p>
            </div>

            {/* Phone Frame */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative"
            >
              {/* Phone bezel */}
              <div className="bg-slate-800 rounded-[3rem] p-3 shadow-2xl">
                {/* Dynamic Island */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-10" />

                {/* Screen - scrollable iframe */}
                <div className="w-[393px] h-[750px] bg-white rounded-[2.5rem] overflow-hidden">
                  <iframe
                    src="/?preview=mobile"
                    className="w-full h-full border-0"
                    title="Mobile Preview"
                  />
                </div>
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full" />
            </motion.div>

            {/* Hint */}
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-sm">
              Scroll inside the phone to navigate
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
