'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Upload, X, AlertCircle, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FormModal, { FormField, Input, Select } from '@/components/admin/FormModal'
import { isSupabaseConfigured } from '@/lib/supabase'

interface GalleryImage {
  id: number
  src: string
  alt: string
  caption: string
  category: string
  sort_order: number
}

const defaultItem = {
  src: '',
  alt: '',
  caption: '',
  category: 'book',
  sort_order: 0,
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<GalleryImage | null>(null)
  const [formData, setFormData] = useState(defaultItem)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery')
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

  const handleEdit = (item: GalleryImage) => {
    setEditItem(item)
    setFormData({
      src: item.src,
      alt: item.alt || '',
      caption: item.caption || '',
      category: item.category,
      sort_order: item.sort_order,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id))
    }
    setDeleteId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = editItem ? 'PUT' : 'POST'
      const body = editItem ? { id: editItem.id, ...formData } : formData

      const response = await fetch('/api/admin/gallery', {
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl font-bold">
            <span className="gradient-text">Gallery</span>
          </h1>
          <p className="text-muted-foreground mt-1">Manage book gallery images</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </motion.div>

      {loading ? (
        <div className="glass rounded-xl p-8 text-center text-muted-foreground">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No images yet. Click &quot;Add Image&quot; to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative glass rounded-xl overflow-hidden"
            >
              <div className="aspect-square relative">
                <Image
                  src={item.src}
                  alt={item.alt || 'Gallery image'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(item)}
                  className="text-white hover:bg-white/20"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteId(item.id)}
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {item.caption && (
                <div className="p-3 border-t border-border">
                  <p className="text-sm text-muted-foreground truncate">{item.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Image' : 'Add Image'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Image URL" required>
          <div className="flex gap-2">
            <Input
              value={formData.src}
              onChange={(e) => setFormData((p) => ({ ...p, src: e.target.value }))}
              placeholder="/uploads/image.jpg"
              required
            />
            <Button type="button" variant="outline" size="sm" disabled>
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Upload images via the Asset Manager or paste a URL
          </p>
        </FormField>
        <FormField label="Alt Text">
          <Input
            value={formData.alt}
            onChange={(e) => setFormData((p) => ({ ...p, alt: e.target.value }))}
            placeholder="Description for accessibility"
          />
        </FormField>
        <FormField label="Caption">
          <Input
            value={formData.caption}
            onChange={(e) => setFormData((p) => ({ ...p, caption: e.target.value }))}
            placeholder="Optional caption"
          />
        </FormField>
        <FormField label="Category">
          <Select
            value={formData.category}
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="book">Book Gallery</option>
            <option value="general">General</option>
          </Select>
        </FormField>
      </FormModal>

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setDeleteId(null)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-background rounded-xl p-6 shadow-xl mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Delete Image</h3>
                  <p className="text-sm text-muted-foreground">This cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteId)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
