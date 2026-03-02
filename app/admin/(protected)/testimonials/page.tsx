'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable, { Column } from '@/components/admin/DataTable'
import FormModal, { FormField, Input, Textarea } from '@/components/admin/FormModal'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  quote: string
  author: string
  role: string
  sort_order: number
}

const defaultItem = {
  quote: '',
  author: '',
  role: '',
  sort_order: 0,
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState(defaultItem)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/testimonials')
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

  const handleEdit = (item: Testimonial) => {
    setEditItem(item)
    setFormData({
      quote: item.quote,
      author: item.author,
      role: item.role || '',
      sort_order: item.sort_order,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number | string) => {
    const response = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
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

      const response = await fetch('/api/admin/testimonials', {
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

  const columns: Column<Testimonial>[] = [
    {
      key: 'quote',
      label: 'Quote',
      render: (item) => (
        <div className="flex items-start gap-2 max-w-md">
          <Quote className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <span className="text-sm line-clamp-2">{item.quote}</span>
        </div>
      ),
    },
    { key: 'author', label: 'Author' },
    { key: 'role', label: 'Role' },
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
          <span className="gradient-text">Testimonials</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage quotes and feedback</p>
      </motion.div>

      <DataTable
        title="Testimonials"
        columns={columns}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Testimonial"
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Testimonial' : 'Add Testimonial'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Quote" required>
          <Textarea
            value={formData.quote}
            onChange={(e) => setFormData((p) => ({ ...p, quote: e.target.value }))}
            placeholder="What they said..."
            rows={4}
            required
          />
        </FormField>
        <FormField label="Author" required>
          <Input
            value={formData.author}
            onChange={(e) => setFormData((p) => ({ ...p, author: e.target.value }))}
            placeholder="Jane Doe"
            required
          />
        </FormField>
        <FormField label="Role/Organization">
          <Input
            value={formData.role}
            onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
            placeholder="Elementary School Teacher"
          />
        </FormField>
      </FormModal>
    </div>
  )
}
