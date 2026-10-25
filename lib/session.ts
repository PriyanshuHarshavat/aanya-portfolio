/**
 * Signed admin session tokens: "<expiresAtMs>.<hmac>".
 * Uses Web Crypto so it works in both middleware (edge) and API routes (node).
 * The signing key is derived from ADMIN_PASSWORD, so changing the password logs everyone out.
 */

export const SESSION_COOKIE = 'admin_session'
export const SESSION_DURATION_SECONDS = 60 * 60 * 24

const encoder = new TextEncoder()

async function sign(payload: string): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD not configured')

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`admin-session:${secret}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = String(Date.now() + SESSION_DURATION_SECONDS * 1000)
  return `${expiresAt}.${await sign(expiresAt)}`
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !process.env.ADMIN_PASSWORD) return false

  const [expiresAt, sig] = token.split('.')
  if (!expiresAt || !sig || Number(expiresAt) < Date.now()) return false

  const expected = await sign(expiresAt)
  if (expected.length !== sig.length) return false

  // Constant-time compare
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  return diff === 0
}
