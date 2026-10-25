'use client'

import { useRef, useState } from 'react'
import { ImagePlus, RefreshCw, X } from 'lucide-react'

/** Longest side after shrinking — plenty for any spot on the site */
const MAX_DIMENSION = 2400
/** Files under this size upload as-is (Vercel rejects request bodies over ~4.5MB) */
const SHRINK_ABOVE_BYTES = 1.5 * 1024 * 1024
/** Formats that must not be redrawn on a canvas (icons, vectors, animations) */
const KEEP_AS_IS = ['image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/gif']

interface ImageDropProps {
  value: string
  onChange: (url: string) => void
  /** Storage folder, e.g. "site", "book", "gallery", "seo" */
  folder: string
  /** Preview box shape */
  shape?: 'square' | 'wide' | 'portrait' | 'icon'
  accept?: string
  /** Built-in image the site shows when nothing has been uploaded */
  fallback?: string
}

const shapeClass = {
  square: 'w-full aspect-square max-w-xs',
  wide: 'w-full aspect-[1200/630] max-w-sm',
  portrait: 'w-full aspect-[3/4] max-w-xs',
  icon: 'w-24 h-24',
}

/** Redraws large photos smaller so they upload quickly and under the size limit */
async function shrinkImage(file: File): Promise<File> {
  if (KEEP_AS_IS.includes(file.type) || file.size <= SHRINK_ABOVE_BYTES) return file

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  // PNGs may have transparency, so keep them as WebP; photos become JPEG
  const type = file.type === 'image/png' ? 'image/webp' : 'image/jpeg'
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85))
  if (!blob) return file

  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg'
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.' + ext, { type: blob.type })
}

/**
 * Drag-and-drop (or click) image picker. Uploads straight to Supabase Storage
 * and hands the public URL back via onChange — nobody ever types a link.
 */
export default function ImageDrop({
  value,
  onChange,
  folder,
  shape = 'square',
  accept = 'image/*',
  fallback,
}: ImageDropProps) {
  const preview = value || fallback
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (picked: File | undefined) => {
    if (!picked) return
    if (!picked.type.startsWith('image/')) {
      setError('That isn’t a photo. Please pick a JPG or PNG image.')
      return
    }

    setError('')
    setUploading(true)
    try {
      let file: File
      try {
        file = await shrinkImage(picked)
      } catch {
        setError('This photo format isn’t supported. Please pick a JPG or PNG image.')
        return
      }

      const body = new FormData()
      body.append('file', file)
      body.append('folder', folder)

      const response = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = await response.json().catch(() => ({}))

      if (response.status === 401) {
        setError('You’ve been logged out. Please log in again and retry.')
      } else if (response.status === 413) {
        setError('That photo is too big. Please pick a smaller one.')
      } else if (!response.ok || !data.url) {
        setError(data.error || 'Upload didn’t work. Please try again.')
      } else {
        onChange(data.url)
      }
    } catch {
      setError('Upload didn’t work. Check your internet and try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!uploading) upload(e.dataTransfer.files?.[0])
        }}
        className={`group relative ${shapeClass[shape]} rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-colors ${
          dragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/60 bg-muted/30'
        }`}
      >
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Current image"
            className={`absolute inset-0 w-full h-full ${shape === 'icon' ? 'object-contain p-2' : 'object-cover'}`}
          />
        )}

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-sm transition-opacity ${
            preview
              ? 'bg-black/55 text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
              : 'text-muted-foreground'
          } ${dragging || uploading ? 'opacity-100' : ''}`}
        >
          {uploading ? (
            <>
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6" />
              {shape !== 'icon' && (
                <span>{preview ? 'Drop a new photo or click to replace' : 'Drop a photo here or click to choose'}</span>
              )}
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </div>

      {value && !uploading && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500"
        >
          <X className="w-3 h-3" />
          Remove photo
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
