'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable, { Column } from '@/components/admin/DataTable'
import FormModal, { FormField, Input, Textarea, Select } from '@/components/admin/FormModal'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle } from 'lucide-react'

interface CommunityService {
  id: number
  category: string
  category_icon: string
  category_color: string
  organization: string
  role: string
  period: string
  description: string
  icon: string
  sort_order: number
}

const defaultItem = {
  category: '',
  category_icon: 'Heart',
  category_color: 'blue',
  organization: '',
  role: '',
  period: '',
  description: '',
  icon: 'Heart',
  sort_order: 0,
}

const iconOptions = ['Heart', 'Users', 'GraduationCap', 'BookOpen', 'Package', 'ShoppingBag', 'Book']
const colorOptions = ['blue', 'orange', 'purple', 'green', 'red', 'amber']

export default function CommunityPage() {
  const [items, setItems] = useState<CommunityService[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<CommunityService | null>(null)
  const [formData, setFormData] = useState(defaultItem)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/community')
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

  const handleEdit = (item: CommunityService) => {
    setEditItem(item)
    setFormData({
      category: item.category,
      category_icon: item.category_icon || 'Heart',
      category_color: item.category_color || 'blue',
      organization: item.organization,
      role: item.role || '',
      period: item.period || '',
      description: item.description || '',
      icon: item.icon || 'Heart',
      sort_order: item.sort_order,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number | string) => {
    const response = await fetch(`/api/admin/community?id=${id}`, { method: 'DELETE' })
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

      const response = await fetch('/api/admin/community', {
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

  const columns: Column<CommunityService>[] = [
    { key: 'category', label: 'Category' },
    { key: 'organization', label: 'Organization' },
    { key: 'role', label: 'Role' },
    { key: 'period', label: 'Period' },
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
          <span className="gradient-text">Community Service</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage volunteer organizations</p>
      </motion.div>

      <DataTable
        title="Community Service"
        columns={columns}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Organization"
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Organization' : 'Add Organization'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" required>
            <Input
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
              placeholder="Education & Tutoring"
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
        <FormField label="Organization" required>
          <Input
            value={formData.organization}
            onChange={(e) => setFormData((p) => ({ ...p, organization: e.target.value }))}
            placeholder="Community Tutoring Program"
            required
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Role">
            <Input
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
              placeholder="Volunteer Tutor"
            />
          </FormField>
          <FormField label="Period">
            <Input
              value={formData.period}
              onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))}
              placeholder="2023 - Present"
            />
          </FormField>
        </div>
        <FormField label="Description">
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            placeholder="Describe your role..."
          />
        </FormField>
        <FormField label="Item Icon">
          <Select
            value={formData.icon}
            onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
          >
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>{icon}</option>
            ))}
          </Select>
        </FormField>
      </FormModal>
    </div>
  )
}
