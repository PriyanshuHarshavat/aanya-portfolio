'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(redirect)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="glass rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Access</h1>
          <p className="text-muted-foreground mt-2">
            Enter your password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                placeholder="Enter admin password"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-500 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white py-3"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-md animate-pulse">
            <div className="glass rounded-2xl p-8 shadow-xl">
              <div className="h-32 bg-muted rounded mb-6" />
              <div className="h-12 bg-muted rounded mb-4" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
