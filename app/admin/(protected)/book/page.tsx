'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Save, RefreshCw, AlertCircle, Upload, BookOpen, Video, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isSupabaseConfigured } from '@/lib/supabase'

interface BookField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'url' | 'image'
  section: string
  placeholder?: string
  hint?: string
}

const bookFields: BookField[] = [
  // Book Details
  { key: 'book_title', label: 'Book Title', type: 'text', section: 'Book Details', placeholder: 'Annie and Froggy Make a Friend' },
  { key: 'book_description', label: 'Short Description', type: 'textarea', section: 'Book Details', placeholder: 'A heartwarming children\'s book about friendship...', hint: 'Brief description shown on the main page' },
  { key: 'book_synopsis', label: 'Full Synopsis', type: 'textarea', section: 'Book Details', placeholder: 'Detailed story description...', hint: 'Longer description of the book' },
  { key: 'book_cover_image', label: 'Book Cover Image', type: 'image', section: 'Book Details', placeholder: '/uploads/book-cover.png' },
  { key: 'book_purchase_link', label: 'Purchase Link (optional)', type: 'url', section: 'Book Details', placeholder: 'https://amazon.com/...', hint: 'Leave empty to hide the purchase button' },

  // Video Section
  { key: 'book_video_title', label: 'Video Section Title', type: 'text', section: 'Video', placeholder: 'Watch Aanya Read to Students' },
  { key: 'book_video_src', label: 'Video File URL', type: 'url', section: 'Video', placeholder: '/uploads/book-presentation.mp4', hint: 'URL to the video file (MP4)' },
  { key: 'book_video_poster', label: 'Video Thumbnail', type: 'image', section: 'Video', placeholder: '/uploads/video-poster.jpg', hint: 'Image shown before video plays' },
]

export default function BookPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

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
          if (item.key.startsWith('book_')) {
            map[item.key] = item.value || ''
          }
        }
        setValues(map)
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (fieldKey: string, file: File) => {
    setUploadingField(fieldKey)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'book')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setValues(prev => ({ ...prev, [fieldKey]: data.url }))
      } else {
        const errData = await response.json()
        setError(errData.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed')
    } finally {
      setUploadingField(null)
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
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  // Group fields by section
  const sections = bookFields.reduce((acc, field) => {
    if (!acc[field.section]) acc[field.section] = []
    acc[field.section].push(field)
    return acc
  }, {} as Record<string, BookField[]>)

  if (!isSupabaseConfigured) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Supabase Not Configured</h2>
          <p className="text-muted-foreground">Connect Supabase to manage book content.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Published Work</h1>
          <p className="text-muted-foreground mt-1">Edit your book details and video</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500"
        >
          Changes saved successfully!
        </motion.div>
      )}

      <div className="space-y-8">
        {Object.entries(sections).map(([sectionName, fields]) => (
          <motion.div
            key={sectionName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              {sectionName === 'Book Details' ? (
                <BookOpen className="w-5 h-5 text-primary" />
              ) : (
                <Video className="w-5 h-5 text-primary" />
              )}
              <h2 className="text-lg font-semibold">{sectionName}</h2>
            </div>

            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                  </label>

                  {field.type === 'image' ? (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={values[field.key] || ''}
                          onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={el => { fileInputRefs.current[field.key] = el }}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(field.key, file)
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRefs.current[field.key]?.click()}
                          disabled={uploadingField === field.key}
                        >
                          {uploadingField === field.key ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {values[field.key] && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                          <Image
                            src={values[field.key]}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={values[field.key] || ''}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  ) : (
                    <input
                      type={field.type === 'url' ? 'url' : 'text'}
                      value={values[field.key] || ''}
                      onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  )}

                  {field.hint && (
                    <p className="text-xs text-muted-foreground mt-1.5">{field.hint}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Gallery Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Photo Gallery</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Book gallery images are managed in the Gallery section. Images with category &quot;book&quot; will appear in the book section.
          </p>
          <Button variant="outline" asChild>
            <a href="/admin/gallery">Go to Gallery</a>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
