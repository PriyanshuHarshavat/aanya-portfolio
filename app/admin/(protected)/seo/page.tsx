'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Save,
  RefreshCw,
  AlertCircle,
  Globe,
  Image as ImageIcon,
  BookOpen,
  Upload,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isSupabaseConfigured } from '@/lib/supabase'

const TITLE_LIMIT = 60
const DESCRIPTION_LIMIT = 160

interface SeoValues {
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_image: string
  favicon: string
  book_title: string
  book_description: string
  book_image: string
  site_url: string
  person_description: string
}

const defaultValues: SeoValues = {
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_image: '',
  favicon: '',
  book_title: '',
  book_description: '',
  book_image: '',
  site_url: '',
  person_description: '',
}

export default function SeoPage() {
  const [values, setValues] = useState<SeoValues>(defaultValues)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const ogImageInputRef = useRef<HTMLInputElement>(null)
  const bookImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSeoSettings()
  }, [])

  const fetchSeoSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/seo')
      if (response.ok) {
        const data = await response.json()
        const map: Record<string, string> = {}
        for (const item of data) {
          map[item.key] = item.value || ''
        }
        setValues({
          meta_title: map.meta_title || '',
          meta_description: map.meta_description || '',
          meta_keywords: map.meta_keywords || '',
          og_image: map.og_image || '',
          favicon: map.favicon || '',
          book_title: map.book_title || '',
          book_description: map.book_description || '',
          book_image: map.book_image || '',
          site_url: map.site_url || '',
          person_description: map.person_description || '',
        })
      }
    } catch (err) {
      console.error('Failed to fetch SEO settings:', err)
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
      const response = await fetch('/api/admin/seo', {
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
      setError('Failed to save SEO settings')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (
    file: File,
    field: 'favicon' | 'og_image' | 'book_image'
  ) => {
    setUploading(field)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'seo')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setValues((prev) => ({ ...prev, [field]: data.url }))
      } else {
        setError('Failed to upload image')
      }
    } catch {
      setError('Failed to upload image')
    } finally {
      setUploading(null)
    }
  }

  const getCharCountClass = (current: number, limit: number) => {
    if (current > limit) return 'text-red-500'
    if (current > limit * 0.9) return 'text-amber-500'
    return 'text-muted-foreground'
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Supabase Not Configured</h2>
          <p className="text-muted-foreground">
            Please set up Supabase to edit SEO settings. See the dashboard for instructions.
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
            <span className="gradient-text">SEO Settings</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Optimize how your site appears in search results
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchSeoSettings} disabled={loading}>
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
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300"
        >
          SEO settings saved successfully!
        </motion.div>
      )}

      {loading ? (
        <div className="glass rounded-xl p-8 text-center text-muted-foreground">
          Loading SEO settings...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Google Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Google Search Preview</h2>
            </div>
            <div className="p-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  {values.favicon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={values.favicon} alt="Favicon" className="w-6 h-6 rounded" />
                  )}
                  <span className="text-sm text-slate-500">
                    {values.site_url || 'aanyaharshavat.com'}
                  </span>
                </div>
                <div className="text-blue-600 dark:text-blue-400 text-xl hover:underline cursor-pointer truncate">
                  {values.meta_title || 'Your Page Title'}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                  {values.meta_description || 'Your meta description will appear here...'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Favicon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-display text-lg font-semibold">Favicon</h2>
              <p className="text-sm text-muted-foreground">The small icon in browser tabs</p>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {values.favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={values.favicon} alt="Favicon preview" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="url"
                    value={values.favicon}
                    onChange={(e) => setValues((prev) => ({ ...prev, favicon: e.target.value }))}
                    placeholder="/favicon.ico or upload an image"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="flex gap-2">
                    <input
                      ref={faviconInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/x-icon,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, 'favicon')
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => faviconInputRef.current?.click()}
                      disabled={uploading === 'favicon'}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading === 'favicon' ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    {values.favicon && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setValues((prev) => ({ ...prev, favicon: '' }))}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 32x32 or 180x180 pixels. PNG, ICO, or SVG format.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Homepage SEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-display text-lg font-semibold">Homepage SEO</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium">Meta Title</label>
                  <span className={`text-xs ${getCharCountClass(values.meta_title.length, TITLE_LIMIT)}`}>
                    {values.meta_title.length}/{TITLE_LIMIT}
                  </span>
                </div>
                <input
                  type="text"
                  value={values.meta_title}
                  onChange={(e) => setValues((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="Aanya Harshavat | Author, Scholar, Changemaker"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Shows in browser tab and Google search results
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium">Meta Description</label>
                  <span className={`text-xs ${getCharCountClass(values.meta_description.length, DESCRIPTION_LIMIT)}`}>
                    {values.meta_description.length}/{DESCRIPTION_LIMIT}
                  </span>
                </div>
                <textarea
                  value={values.meta_description}
                  onChange={(e) => setValues((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="High school sophomore and published author passionate about making an impact..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Keywords</label>
                <input
                  type="text"
                  value={values.meta_keywords}
                  onChange={(e) => setValues((prev) => ({ ...prev, meta_keywords: e.target.value }))}
                  placeholder="Aanya Harshavat, student portfolio, published author"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords</p>
              </div>

              {/* OG Image */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Social Share Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={values.og_image}
                    onChange={(e) => setValues((prev) => ({ ...prev, og_image: e.target.value }))}
                    placeholder="/og-image.png"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    ref={ogImageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'og_image')
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => ogImageInputRef.current?.click()}
                    disabled={uploading === 'og_image'}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {values.og_image && (
                  <div className="relative aspect-[1200/630] max-w-sm rounded-lg overflow-hidden border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={values.og_image}
                      alt="Social share preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1200x630 pixels for optimal display on social platforms
                </p>
              </div>
            </div>
          </motion.div>

          {/* Book Page SEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Book Page SEO</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Book Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium">Page Title</label>
                  <span className={`text-xs ${getCharCountClass(values.book_title.length, TITLE_LIMIT)}`}>
                    {values.book_title.length}/{TITLE_LIMIT}
                  </span>
                </div>
                <input
                  type="text"
                  value={values.book_title}
                  onChange={(e) => setValues((prev) => ({ ...prev, book_title: e.target.value }))}
                  placeholder="Annie and Froggy Make a Friend | Aanya Harshavat"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Book Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium">Page Description</label>
                  <span className={`text-xs ${getCharCountClass(values.book_description.length, DESCRIPTION_LIMIT)}`}>
                    {values.book_description.length}/{DESCRIPTION_LIMIT}
                  </span>
                </div>
                <textarea
                  value={values.book_description}
                  onChange={(e) => setValues((prev) => ({ ...prev, book_description: e.target.value }))}
                  placeholder="Read Annie and Froggy Make a Friend - a children's book about friendship..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              {/* Book Image */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Social Share Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={values.book_image}
                    onChange={(e) => setValues((prev) => ({ ...prev, book_image: e.target.value }))}
                    placeholder="/book-og-image.png"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    ref={bookImageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'book_image')
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => bookImageInputRef.current?.click()}
                    disabled={uploading === 'book_image'}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                {values.book_image && (
                  <div className="relative aspect-[1200/630] max-w-sm rounded-lg overflow-hidden border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={values.book_image}
                      alt="Book social share preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Advanced / Structured Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-display text-lg font-semibold">Structured Data (JSON-LD)</h2>
              <p className="text-sm text-muted-foreground">
                Helps search engines understand your site better
              </p>
            </div>
            <div className="p-6 space-y-6">
              {/* Site URL */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Site URL</label>
                <input
                  type="url"
                  value={values.site_url}
                  onChange={(e) => setValues((prev) => ({ ...prev, site_url: e.target.value }))}
                  placeholder="https://aanyaharshavat.com"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Person Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Person Description (for schema)</label>
                <textarea
                  value={values.person_description}
                  onChange={(e) => setValues((prev) => ({ ...prev, person_description: e.target.value }))}
                  placeholder="High school sophomore and published author..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in structured data to describe the site owner
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
