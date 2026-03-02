'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Microscope,
  Heart,
  Trophy,
  Image,
  Quote,
  Video,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Site Content', href: '/admin/content', icon: FileText },
  { label: 'SEO', href: '/admin/seo', icon: Search },
  { label: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { label: 'Research', href: '/admin/research', icon: Microscope },
  { label: 'Community', href: '/admin/community', icon: Heart },
  { label: 'Activities', href: '/admin/activities', icon: Trophy },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
  { label: 'Videos', href: '/admin/videos', icon: Video },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur border-b border-border z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-display font-bold gradient-text">Admin Panel</span>
        <Link href="/" className="p-2 hover:bg-muted rounded-lg">
          <Home className="w-5 h-5" />
        </Link>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-background border-r border-border z-50 overflow-y-auto"
            >
              <div className="p-4 flex items-center justify-between border-b border-border">
                <span className="font-display font-bold gradient-text">Admin Panel</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-medium'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  )
                })}
              </nav>
              <div className="p-4 border-t border-border mt-auto">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[280px] bg-background border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin/dashboard">
            <h1 className="font-display text-xl font-bold gradient-text">Admin Panel</h1>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Manage your content</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-medium'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Home className="w-5 h-5" />
              View Site
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-[280px] pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
