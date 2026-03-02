'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DataTable, { Column } from '@/components/admin/DataTable'
import FormModal, { FormField, Input, Select } from '@/components/admin/FormModal'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle } from 'lucide-react'

interface Course {
  id: number
  year: string
  semester: string
  name: string
  type: string
  subject: string
  sort_order: number
}

const defaultCourse: Omit<Course, 'id'> = {
  year: '',
  semester: '',
  name: '',
  type: 'Core',
  subject: '',
  sort_order: 0,
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Course | null>(null)
  const [formData, setFormData] = useState(defaultCourse)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditItem(null)
    setFormData({ ...defaultCourse, sort_order: courses.length })
    setModalOpen(true)
  }

  const handleEdit = (item: Course) => {
    setEditItem(item)
    setFormData({
      year: item.year,
      semester: item.semester,
      name: item.name,
      type: item.type,
      subject: item.subject,
      sort_order: item.sort_order,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id: number | string) => {
    const response = await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' })
    if (response.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = editItem ? 'PUT' : 'POST'
      const body = editItem ? { id: editItem.id, ...formData } : formData

      const response = await fetch('/api/admin/courses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const data = await response.json()
        if (editItem) {
          setCourses((prev) => prev.map((c) => (c.id === editItem.id ? data : c)))
        } else {
          setCourses((prev) => [...prev, data])
        }
        setModalOpen(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const columns: Column<Course>[] = [
    { key: 'year', label: 'Year' },
    { key: 'semester', label: 'Semester' },
    { key: 'name', label: 'Course Name' },
    {
      key: 'type',
      label: 'Type',
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.type === 'AP'
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
              : item.type === 'Honors'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {item.type}
        </span>
      ),
    },
    { key: 'subject', label: 'Subject' },
  ]

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">Supabase Not Configured</h2>
          <p className="text-muted-foreground">
            Please set up Supabase to manage courses.
          </p>
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
          <span className="gradient-text">Courses</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage academic courses</p>
      </motion.div>

      <DataTable
        title="Academic Courses"
        description="Courses shown in the Academic Journey section"
        columns={columns}
        data={courses}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addLabel="Add Course"
      />

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Course' : 'Add Course'}
        onSubmit={handleSubmit}
        loading={saving}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Year" required>
            <Input
              value={formData.year}
              onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
              placeholder="Freshman"
              required
            />
          </FormField>
          <FormField label="Semester" required>
            <Input
              value={formData.semester}
              onChange={(e) => setFormData((p) => ({ ...p, semester: e.target.value }))}
              placeholder="2024-2025"
              required
            />
          </FormField>
        </div>
        <FormField label="Course Name" required>
          <Input
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="Honors English 9"
            required
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type" required>
            <Select
              value={formData.type}
              onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
              required
            >
              <option value="Core">Core</option>
              <option value="Honors">Honors</option>
              <option value="AP">AP</option>
            </Select>
          </FormField>
          <FormField label="Subject" required>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
              placeholder="English"
              required
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  )
}
