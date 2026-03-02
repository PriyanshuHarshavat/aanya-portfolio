'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  submitLabel?: string
  loading?: boolean
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = 'Save',
  loading = false,
}: FormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-background rounded-xl shadow-xl mx-4">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={onSubmit}>
                <div className="p-4 space-y-4">{children}</div>
                <div className="flex gap-3 justify-end p-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {loading ? 'Saving...' : submitLabel}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Form Field Components
export function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

export function Input({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${props.className || ''}`}
    />
  )
}

export function Textarea({
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${props.className || ''}`}
    />
  )
}

export function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${props.className || ''}`}
    >
      {children}
    </select>
  )
}
