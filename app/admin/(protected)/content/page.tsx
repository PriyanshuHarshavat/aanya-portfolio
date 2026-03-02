'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isSupabaseConfigured } from '@/lib/supabase'

interface ContentField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'url'
  section: string
  placeholder?: string
}

const contentFields: ContentField[] = [
  // Basic Info
  { key: 'name', label: 'Name', type: 'text', section: 'Basic Info', placeholder: 'Aanya Harshavat' },
  { key: 'tagline', label: 'Tagline', type: 'text', section: 'Basic Info', placeholder: 'Author | Scholar | Changemaker' },
  { key: 'email', label: 'Email', type: 'text', section: 'Basic Info', placeholder: 'email@example.com' },
  { key: 'linkedin', label: 'LinkedIn URL', type: 'url', section: 'Basic Info' },
  { key: 'github', label: 'GitHub URL', type: 'url', section: 'Basic Info' },

  // Hero Section
  { key: 'hero_headline', label: 'Headline', type: 'text', section: 'Hero', placeholder: 'Building Tomorrow,' },
  { key: 'hero_headline_accent', label: 'Headline Accent', type: 'text', section: 'Hero', placeholder: 'Today.' },
  { key: 'hero_subheadline', label: 'Subheadline', type: 'textarea', section: 'Hero' },
  { key: 'hero_badge', label: 'Badge Text', type: 'text', section: 'Hero', placeholder: 'Published Author' },
  { key: 'hero_cta', label: 'CTA Button', type: 'text', section: 'Hero', placeholder: 'Get in Touch' },
  { key: 'hero_image', label: 'Hero Image URL', type: 'url', section: 'Hero', placeholder: '/uploads/headshot.jpg' },

  // About Section
  { key: 'about_title', label: 'Section Title', type: 'text', section: 'About', placeholder: 'About Me' },
  { key: 'about_bio', label: 'Bio (paragraphs separated by blank lines)', type: 'textarea', section: 'About' },
  { key: 'about_image', label: 'About Image URL', type: 'url', section: 'About' },
  { key: 'about_quote', label: 'Quote', type: 'textarea', section: 'About' },

  // YouTube Section
  { key: 'youtube_title', label: 'Section Title', type: 'text', section: 'YouTube', placeholder: 'KalmKids' },
  { key: 'youtube_subtitle', label: 'Subtitle', type: 'text', section: 'YouTube', placeholder: 'Watch & Learn' },
  { key: 'youtube_channel_url', label: 'Channel URL', type: 'url', section: 'YouTube' },

  // Academic
  { key: 'academic_gpa', label: 'GPA', type: 'text', section: 'Academic', placeholder: '4.0' },
  { key: 'academic_current_year', label: 'Current Year', type: 'text', section: 'Academic', placeholder: 'Sophomore' },

  // Community Service
  { key: 'community_total_hours', label: 'Total Hours', type: 'text', section: 'Community', placeholder: '150+' },
  { key: 'community_years_active', label: 'Years Active', type: 'text', section: 'Community', placeholder: '3' },
]

export default function ContentPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/content')
      if (response.ok) {
        const data = await response.json()
        const map: Record<string, string> = {}
        for (const item of data) {
          map[item.key] = item.value || ''
        }
        setValues(map)
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      const items = Object.entries(values).map(([key, value]) => ({ key, value }))
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save')
      }
    } catch {
      setError('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const sections = [...new Set(contentFields.map((f) => f.section))]

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Supabase Not Configured</h2>
          <p className="text-muted-foreground">
            Please set up Supabase to edit content. See the dashboard for instructions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold">
            <span className="gradient-text">Site Content</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Edit basic info, hero, and about sections
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchContent} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300"
        >
          Content saved successfully!
        </motion.div>
      )}

      {loading ? (
        <div className="glass rounded-xl p-8 text-center text-muted-foreground">
          Loading content...
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="font-display text-lg font-semibold">{section}</h2>
              </div>
              <div className="p-6 space-y-4">
                {contentFields
                  .filter((f) => f.section === section)
                  .map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium mb-1.5">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={values[field.key] || ''}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                      ) : (
                        <input
                          type={field.type === 'url' ? 'url' : 'text'}
                          value={values[field.key] || ''}
                          onChange={(e) =>
                            setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
