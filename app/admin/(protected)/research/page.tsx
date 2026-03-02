'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable, { Column } from '@/components/admin/DataTable'
import FormModal, { FormField, Input, Textarea } from '@/components/admin/FormModal'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle } from 'lucide-react'

interface Research {
  id: number
  institution: string
  department: string
  project_title: string
  duration: string
  period: string
  description: string
  outcomes: string[]
  skills: string[]
  sort_order: number
}

const defaultResearch = {
  institution: '',
  department: '',
  project_title: '',
  duration: '',
  period: '',
  description: '',
  outcomes: [] as string[],
  skills: [] as string[],
  sort_order: 0,
}

export default function ResearchPage() {
  const [items, setItems] = useState<Research[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Research | null>(null)
  const [formData, setFormData] = useState(defaultResearch)
  const [outcomesText, setOutcomesText] = useState('')
  const [skillsText, setSkillsText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/research')
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
    setFormData({ ...defaultResearch, sort_order: items.length })
    setOutcomesText('')
    setSkillsText('')
    setModalOpen(true)
  }

  const handleEdit = (item: Research) => {
    setEditItem(item)
    setFormData({
      institution: item.institution,
      department: item.department,
      project_title: item.project_title,
      duration: item.duration || '',
      period: item.period || '',
      description: item.description || '',
      outcomes: item.outcomes || [],
      skills: item.skills || [],
      sort_order: item.sort_order,
    })
    setOutcomesText((item.outcomes || []).join('\n'))
    setSkillsText((item.skills || []).join(', '))
    setModalOpen(true)
  }

  const handleDelete = async (id: number | string) => {
    const response = await fetch(`/api/admin/research?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const outcomes = outcomesText.split('\n').map((s) => s.trim()).filter(Boolean)
    const skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean)

    try {
      const method = editItem ? 'PUT' : 'POST'
      const body = editItem
        ? { id: editItem.id, ...formData, outcomes, skills }
        : { ...formData, outcomes, skills }

      const response = await fetch('/api/admin/research', {
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

  const columns: Column<Research>[] = [
    { key: 'institution', label: 'Institution' },
    { key: 'department', label: 'Department' },
    { key: 'project_title', label: 'Project' },
    { key: 'period', label: 'Period' },
  ]

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Supabase Not Configured</h2>
          <p className="text-muted-foreground">Please set up Supabase to manage research.</p>
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
          <span className="gradient-text">Research</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage research experiences</p>
      </motion.div>

      <DataTable
        title="Research Experiences"
        columns={columns}
        data={items}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Research"
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Research' : 'Add Research'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <FormField label="Institution" required>
          <Input
            value={formData.institution}
            onChange={(e) => setFormData((p) => ({ ...p, institution: e.target.value }))}
            placeholder="Northwestern University"
            required
          />
        </FormField>
        <FormField label="Department" required>
          <Input
            value={formData.department}
            onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
            placeholder="Department of Psychology"
            required
          />
        </FormField>
        <FormField label="Project Title" required>
          <Input
            value={formData.project_title}
            onChange={(e) => setFormData((p) => ({ ...p, project_title: e.target.value }))}
            placeholder="AI-Assisted Analysis..."
            required
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Duration">
            <Input
              value={formData.duration}
              onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
              placeholder="6 weeks"
            />
          </FormField>
          <FormField label="Period">
            <Input
              value={formData.period}
              onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))}
              placeholder="Summer 2025"
            />
          </FormField>
        </div>
        <FormField label="Description">
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            rows={3}
            placeholder="Describe the research project..."
          />
        </FormField>
        <FormField label="Outcomes (one per line)">
          <Textarea
            value={outcomesText}
            onChange={(e) => setOutcomesText(e.target.value)}
            rows={3}
            placeholder="Outcome 1&#10;Outcome 2&#10;Outcome 3"
          />
        </FormField>
        <FormField label="Skills (comma-separated)">
          <Input
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="Research Methods, Data Analysis, Writing"
          />
        </FormField>
      </FormModal>
    </div>
  )
}
