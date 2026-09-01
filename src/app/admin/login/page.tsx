import type { Metadata } from 'next'
import { AdminLoginForm } from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login - HalalPro',
  robots: 'noindex',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">HalalPro Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Masuk ke panel administrasi</p>
        </div>

        <AdminLoginForm />

        <p className="mt-6 text-center text-xs text-gray-400">
          Area terbatas. Hanya untuk staf HalalPro.
        </p>
      </div>
    </div>
  )
}
