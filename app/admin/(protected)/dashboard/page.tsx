'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  GraduationCap,
  Microscope,
  Heart,
  Trophy,
  Image,
  Quote,
  Video,
  ArrowRight,
  Database,
  AlertCircle,
} from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'

const quickLinks = [
  {
    label: 'Site Content',
    href: '/admin/content',
    icon: FileText,
    description: 'Edit basic info, hero, about section',
    color: 'from-blue-500 to-blue-600',
  },
  {
    label: 'Courses',
    href: '/admin/courses',
    icon: GraduationCap,
    description: 'Manage academic courses',
    color: 'from-purple-500 to-purple-600',
  },
  {
    label: 'Research',
    href: '/admin/research',
    icon: Microscope,
    description: 'Research experiences',
    color: 'from-green-500 to-green-600',
  },
  {
    label: 'Community',
    href: '/admin/community',
    icon: Heart,
    description: 'Community service orgs',
    color: 'from-red-500 to-red-600',
  },
  {
    label: 'Activities',
    href: '/admin/activities',
    icon: Trophy,
    description: 'Sports, arts, clubs',
    color: 'from-orange-500 to-orange-600',
  },
  {
    label: 'Gallery',
    href: '/admin/gallery',
    icon: Image,
    description: 'Book gallery images',
    color: 'from-pink-500 to-pink-600',
  },
  {
    label: 'Testimonials',
    href: '/admin/testimonials',
    icon: Quote,
    description: 'Manage quotes',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    label: 'Videos',
    href: '/admin/videos',
    icon: Video,
    description: 'YouTube videos',
    color: 'from-amber-500 to-amber-600',
  },
]

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          <span className="gradient-text">Welcome Back</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your portfolio content from here
        </p>
      </motion.div>

      {/* Supabase Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`mb-8 p-4 rounded-xl border ${
          isSupabaseConfigured
            ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
        }`}
      >
        <div className="flex items-start gap-3">
          {isSupabaseConfigured ? (
            <Database className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          )}
          <div>
            <p
              className={`font-medium ${
                isSupabaseConfigured
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-amber-800 dark:text-amber-200'
              }`}
            >
              {isSupabaseConfigured
                ? 'Database Connected'
                : 'Supabase Not Configured'}
            </p>
            <p
              className={`text-sm ${
                isSupabaseConfigured
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-amber-700 dark:text-amber-300'
              }`}
            >
              {isSupabaseConfigured
                ? 'Your changes will be saved to the database'
                : 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Links Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Link
              href={link.href}
              className="group block glass rounded-xl p-5 card-hover h-full"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                {link.label}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-sm text-muted-foreground">
                {link.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Setup Instructions */}
      {!isSupabaseConfigured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass rounded-xl p-6"
        >
          <h2 className="font-display text-xl font-bold mb-4">Setup Instructions</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                1
              </span>
              <span>
                Go to{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  supabase.com
                </a>{' '}
                and create a free account
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                2
              </span>
              <span>Create a new project (name it &quot;aanya-portfolio&quot;)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                3
              </span>
              <span>
                Go to Settings → API and copy the URL and anon key
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                4
              </span>
              <span>
                Create <code className="bg-muted px-1 rounded">.env.local</code> with the credentials
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                5
              </span>
              <span>
                Run the database migration script:{' '}
                <code className="bg-muted px-1 rounded">npx ts-node scripts/seed-database.ts</code>
              </span>
            </li>
          </ol>
        </motion.div>
      )}
    </div>
  )
}
