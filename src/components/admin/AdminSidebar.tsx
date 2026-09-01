'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  Package,
  MessageSquare,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import type { AdminSession } from '@/lib/auth'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Pengajuan', icon: FileText },
  { href: '/admin/packages', label: 'Paket', icon: Package },
  { href: '/admin/certificates', label: 'Sertifikat', icon: BadgeCheck },
  { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquare },
  { href: '/admin/faqs', label: 'FAQ', icon: HelpCircle },
]

interface SidebarContentProps {
  pathname: string
  admin: AdminSession
  onNavClick: () => void
  onLogout: () => void
}

function SidebarContent({ pathname, admin, onNavClick, onLogout }: SidebarContentProps) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <span className="font-bold text-gray-900 text-sm">HalalPro</span>
          <span className="block text-[10px] text-green-600 font-medium leading-none">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-green-600 text-white shadow-sm shadow-green-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-green-700 font-bold text-sm">{admin.name.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{admin.name}</p>
            <p className="text-xs text-gray-400 truncate">{admin.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </>
  )
}

export function AdminSidebar({ admin }: { admin: AdminSession }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const sidebarProps: SidebarContentProps = {
    pathname,
    admin,
    onNavClick: () => setMobileOpen(false),
    onLogout: handleLogout,
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex-col z-40">
        <SidebarContent {...sidebarProps} />
      </div>

      {/* Mobile: top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm">HalalPro Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile: drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-white flex flex-col border-r border-gray-100 shadow-xl">
            <SidebarContent {...sidebarProps} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  )
}
