import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      path: filePath,
      url: urlData.publicUrl,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'Path required' }, { status: 400 })
  }

  const { error } = await supabase.storage
    .from('images')
    .remove([path])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
