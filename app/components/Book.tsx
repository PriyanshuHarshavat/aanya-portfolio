'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookContent, bookGallery, bookVideo } from '@/lib/content';
import Image from 'next/image';

export default function Book() {
  const [showVideo, setShowVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section id="book" className="py-24 md:py-32 section-gradient-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Published Work
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            My <span className="gradient-text">Book</span>
          </h2>
        </motion.div>

        {/* Book Info Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 md:w-80 aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src={bookContent.coverImage}
                alt={bookContent.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {bookContent.title}
            </h3>

            <p className="text-lg text-muted-foreground mb-6">
              {bookContent.description}
            </p>

            <p className="text-foreground leading-relaxed mb-8">
              {bookContent.synopsis}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              {bookContent.readOnlineLink && (
                <>
                  {/* Desktop: Link to /book page with iframe */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden md:block">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                      asChild
                    >
                      <a href={bookContent.readOnlineLink}>
                        <BookOpen className="w-5 h-5 mr-2" />
                        Read Online
                      </a>
                    </Button>
                  </motion.div>
                  {/* Mobile: Link directly to flipbook for better experience */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="md:hidden">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
                      asChild
                    >
                      <a href="/flipbook/index.html">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Read Online
                      </a>
                    </Button>
                  </motion.div>
                </>
              )}
              {bookContent.purchaseLink && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                  >
                    <a href={bookContent.purchaseLink} target="_blank" rel="noopener noreferrer">
                      Get the Book
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Video Section */}
        {bookVideo.src && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="font-display text-xl md:text-2xl font-bold text-center mb-8">
              {bookVideo.title}
            </h3>

            <div
              className="relative max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => setShowVideo(true)}
            >
              <Image
                src={bookVideo.poster}
                alt="Video thumbnail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-primary ml-1" fill="currentColor" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Photo Gallery */}
        {bookGallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl md:text-2xl font-bold text-center mb-8">
              Making an Impact
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bookGallery.map((image, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium">
                      {image.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={bookVideo.src}
                controls
                autoPlay
                className="w-full h-full rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev !== null ? (prev - 1 + bookGallery.length) % bookGallery.length : 0
                );
              }}
              className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev !== null ? (prev + 1) % bookGallery.length : 0
                );
              }}
              className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[80vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={bookGallery[selectedImage].src}
                alt={bookGallery[selectedImage].alt}
                width={1200}
                height={800}
                className="object-contain w-full h-full rounded-xl"
              />
              {bookGallery[selectedImage].caption && (
                <p className="text-white text-center mt-4 text-lg">
                  {bookGallery[selectedImage].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
