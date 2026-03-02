import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('key')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const body = await request.json()
  const { key, value } = body

  const { data, error } = await supabase
    .from('site_content')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const body = await request.json()
  const { items } = body // Array of { key, value }

  const updates = items.map((item: { key: string; value: string }) => ({
    key: item.key,
    value: item.value,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('site_content')
    .upsert(updates, { onConflict: 'key' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
