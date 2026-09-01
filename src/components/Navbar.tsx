'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getWhatsAppUrl, DEFAULT_WA_MESSAGE } from '@/lib/types'

const navLinks = [
  { href: '/#layanan', label: 'Layanan' },
  { href: '/#paket', label: 'Paket' },
  { href: '/#proses', label: 'Proses' },
  { href: '/#sertifikat', label: 'Sertifikat' },
  { href: '/#testimoni', label: 'Testimoni' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/tracking', label: 'Cek Status' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass shadow-lg shadow-black/5 border-b border-white/20'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200 group-hover:shadow-green-300 transition-shadow">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-slate-900 text-lg leading-none tracking-tight">HalalPro</span>
              <span className="block text-[10px] text-green-600 font-semibold leading-none">Sertifikasi Halal</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={getWhatsAppUrl(DEFAULT_WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-semibold text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
            >
              WhatsApp
            </a>
            <Link
              href="/ajukan"
              className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-md shadow-green-200 hover:shadow-green-300 transition-all active:scale-[0.97]"
            >
              Ajukan Sekarang
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span className={cn('transition-transform duration-200', open ? 'rotate-90' : '')}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'lg:hidden overflow-hidden transition-all duration-300',
        open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="glass border-t border-white/20 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/ajukan"
              className="block text-center px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold rounded-xl shadow-md"
              onClick={() => setOpen(false)}
            >
              Ajukan Sekarang
            </Link>
            <a
              href={getWhatsAppUrl(DEFAULT_WA_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-2.5 bg-green-50 text-green-700 text-sm font-semibold rounded-xl border border-green-200"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
