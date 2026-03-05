'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable, { Column } from '@/components/admin/DataTable'
import FormModal, { FormField, Input, Textarea } from '@/components/admin/FormModal'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle, ExternalLink } from 'lucide-react'

interface Video {
  id: number
  video_id: string
  title: string
  description: string
  upload_date: string | null
  sort_order: number
}

const defaultItem = {
  video_id: '',
  title: '',
  description: '',
  upload_date: '',
  sort_order: 0,
}

export default function VideosPage() {
  const [items, setItems] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Video | null>(null)
  const [formData, setFormData] = useState(defaultItem)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/videos')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditItem(null)
    setFormData({ ...defaultItem, sort_order: items.length })
    setModalOpen(true)
  }

  const handleEdit = (item: Video) => {
    setEditItem(item)
    setFormData({
      video_id: item.video_id,
      title: item.title,
      description: item.description || '',
      upload_date: item.upload_date || '',
      sort_order: item.sort_order,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number | string) => {
    const response = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = editItem ? 'PUT' : 'POST'
      const body = editItem ? { id: editItem.id, ...formData } : formData

      const response = await fetch('/api/admin/videos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const data = await response.json()
        if (editItem) {
          setItems((prev) => prev.map((c) => (c.id === editItem.id ? data : c)))
        } else {
          setItems((prev) => [...prev, data])
        }
        setModalOpen(false)
      }
    } finally {
      setSaving(false)
    }
  }

  // Extract video ID from YouTube URL if pasted
  const parseVideoId = (input: string) => {
    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // Just the video ID
    ]

    for (const pattern of patterns) {
      const match = input.match(pattern)
      if (match) return match[1]
    }
    return input
  }

  const columns: Column<Video>[] = [
    {
      key: 'preview',
      label: 'Preview',
      render: (item) => (
        <div className="w-24 h-14 relative rounded overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    { key: 'title', label: 'Title' },
    {
      key: 'video_id',
      label: 'Video ID',
      render: (item) => (
        <a
          href={`https://youtube.com/watch?v=${item.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          {item.video_id}
          <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
  ]

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Supabase Not Configured</h2>
          <p className="text-muted-foreground">Please set up Supabase.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold">
          <span className="gradient-text">YouTube Videos</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage embedded videos</p>
      </motion.div>

      <DataTable
        title="Videos"
        columns={columns}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Video"
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Video' : 'Add Video'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Video ID or URL" required>
          <Input
            value={formData.video_id}
            onChange={(e) =>
              setFormData((p) => ({ ...p, video_id: parseVideoId(e.target.value) }))
            }
            placeholder="dQw4w9WgXcQ or full YouTube URL"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Paste a YouTube URL or just the video ID
          </p>
        </FormField>
        {formData.video_id && (
          <div className="rounded-lg overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${formData.video_id}/mqdefault.jpg`}
              alt="Preview"
              className="w-full"
            />
          </div>
        )}
        <FormField label="Title" required>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="Video title"
            required
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            placeholder="Optional description"
            rows={2}
          />
        </FormField>
        <FormField label="Upload Date">
          <Input
            type="date"
            value={formData.upload_date}
            onChange={(e) => setFormData((p) => ({ ...p, upload_date: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used for SEO structured data
          </p>
        </FormField>
      </FormModal>
    </div>
  )
}
