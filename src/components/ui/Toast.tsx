'use client'

import { useState, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Toast {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info' | 'warning'
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...opts, id }])
    setTimeout(() => dismiss(id), 5000)
  }, [dismiss])

  const success = useCallback((title: string, message?: string) => toast({ title, message, type: 'success' }), [toast])
  const error = useCallback((title: string, message?: string) => toast({ title, message, type: 'error' }), [toast])
  const info = useCallback((title: string, message?: string) => toast({ title, message, type: 'info' }), [toast])

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  }

  const borders = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
    warning: 'border-l-yellow-500',
  }

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto bg-white rounded-xl shadow-xl border border-gray-100 border-l-4 p-4 flex items-start gap-3 animate-in slide-in-from-right-5 duration-300',
              borders[t.type]
            )}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{t.title}</p>
              {t.message && <p className="text-sm text-gray-500 mt-0.5">{t.message}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
