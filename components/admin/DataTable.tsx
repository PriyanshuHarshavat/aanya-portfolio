'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, GripVertical, X, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends { id: number | string }> {
  title: string
  description?: string
  columns: Column<T>[]
  data: T[]
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (id: number | string) => Promise<void>
  loading?: boolean
  addLabel?: string
}

export default function DataTable<T extends { id: number | string }>({
  title,
  description,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  addLabel = 'Add New',
}: DataTableProps<T>) {
  const [deleteId, setDeleteId] = useState<number | string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (id: number | string) => {
    if (!onDelete) return
    setDeleting(true)
    try {
      await onDelete(id)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const getValue = (item: T, key: string): React.ReactNode => {
    const keys = key.split('.')
    let value: unknown = item
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return value as React.ReactNode
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No items yet. Click &quot;{addLabel}&quot; to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-10 px-4 py-3"></th>
                {columns.map((col) => (
                  <th
                    key={col.key.toString()}
                    className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${col.className || ''}`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-24 px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key.toString()} className={`px-4 py-3 ${col.className || ''}`}>
                      {col.render ? col.render(item) : getValue(item, col.key.toString())}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-background rounded-xl p-6 shadow-xl mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Delete Item</h3>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteId(null)}
                    disabled={deleting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDelete(deleteId)}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {deleting ? (
                      'Deleting...'
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
