import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a dummy client for build time / when env vars are not set
const dummyClient = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    eq: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
    }),
    order: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
    }),
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: () => Promise.resolve({ data: null, error: null }),
    }),
  },
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : (dummyClient as unknown as ReturnType<typeof createClient>)

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey)
