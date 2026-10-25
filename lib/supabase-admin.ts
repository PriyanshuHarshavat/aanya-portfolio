import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Server-side Supabase client using the service-role key.
 * Used by /api/admin/* routes so the database can stay read-only for the public key.
 * NEVER import this into a client component — the key must stay server-only.
 */
export const isSupabaseAdminConfigured = !!(supabaseUrl && serviceRoleKey)

export const supabaseAdmin = createClient(
  supabaseUrl || 'http://localhost',
  serviceRoleKey || 'missing-key',
  { auth: { persistSession: false } }
)
