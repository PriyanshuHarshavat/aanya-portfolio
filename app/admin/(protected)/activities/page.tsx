'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable, { Column } from '@/components/admin/DataTable'
import FormModal, { FormField, Input, Textarea, Select } from '@/components/admin/FormModal'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle } from 'lucide-react'

interface Activity {
  id: number
  section: string
  category: string
  category_icon: string
  category_color: string
  name: string
  description: string
  period: string
  highlight: string
  sort_order: number
}

const defaultItem = {
  section: 'sports_arts',
  category: '',
  category_icon: 'Trophy',
  category_color: 'orange',
  name: '',
  description: '',
  period: '',
  highlight: '',
  sort_order: 0,
}

const iconOptions = ['Trophy', 'Music', 'Award', 'Users', 'Star', 'Heart']
const colorOptions = ['orange', 'purple', 'blue', 'green', 'amber', 'red']

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Activity | null>(null)
  const [formData, setFormData] = useState(defaultItem)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/activities')
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

  const handleEdit = (item: Activity) => {
    setEditItem(item)
    setFormData({
      section: item.section,
      category: item.category,
      category_icon: item.category_icon || 'Trophy',
      category_color: item.category_color || 'orange',
      name: item.name,
      description: item.description || '',
      period: item.period || '',
      highlight: item.highlight || '',
      sort_order: item.sort_order,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number | string) => {
    const response = await fetch(`/api/admin/activities?id=${id}`, { method: 'DELETE' })
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

      const response = await fetch('/api/admin/activities', {
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

  const columns: Column<Activity>[] = [
    {
      key: 'section',
      label: 'Section',
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.section === 'sports_arts'
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          }`}
        >
          {item.section === 'sports_arts' ? 'Sports & Arts' : 'Clubs & Leadership'}
        </span>
      ),
    },
    { key: 'category', label: 'Category' },
    { key: 'name', label: 'Activity' },
    { key: 'highlight', label: 'Highlight' },
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
          <span className="gradient-text">Activities</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage sports, arts, clubs & leadership</p>
      </motion.div>

      <DataTable
        title="Activities"
        columns={columns}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Activity"
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Activity' : 'Add Activity'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Section" required>
          <Select
            value={formData.section}
            onChange={(e) => setFormData((p) => ({ ...p, section: e.target.value }))}
            required
          >
            <option value="sports_arts">Sports & Arts</option>
            <option value="clubs_leadership">Clubs & Leadership</option>
          </Select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            <Input
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              placeholder="Basketball"
              required
            />
          </FormField>
          <FormField label="Category Icon">
            <Select
              value={formData.category_icon}
              onChange={(e) => setFormData((p) => ({ ...p, category_icon: e.target.value }))}
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </Select>
          </FormField>
        </div>
        <FormField label="Category Color">
          <Select
            value={formData.category_color}
            onChange={(e) => setFormData((p) => ({ ...p, category_color: e.target.value }))}
          >
            {colorOptions.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="Activity Name" required>
          <Input
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="School Basketball Team"
            required
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            rows={3}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Period">
            <Input
              value={formData.period}
              onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))}
              placeholder="Grade 4 - Present"
            />
          </FormField>
          <FormField label="Highlight">
            <Input
              value={formData.highlight}
              onChange={(e) => setFormData((p) => ({ ...p, highlight: e.target.value }))}
              placeholder="6+ years"
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  )
}
