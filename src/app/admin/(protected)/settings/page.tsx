'use client'

import { useState } from 'react'
import { KeyRound, Save, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function SettingsPage() {
  const { success, error: toastError } = useToast()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      toastError('Konfirmasi password tidak cocok')
      return
    }
    if (form.newPassword.length < 8) {
      toastError('Password baru minimal 8 karakter')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toastError(json.error ?? 'Gagal mengubah password')
        return
      }
      success('Password berhasil diubah')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 lg:pt-0 pt-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Akun</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola keamanan akun admin Anda</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
            <KeyRound className="w-4.5 h-4.5 text-green-600" />
          </div>
          <h2 className="font-semibold text-gray-900">Ubah Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Password Saat Ini *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Password Baru * <span className="text-gray-400">(min. 8 karakter)</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                placeholder="Buat password baru"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Konfirmasi Password Baru *
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ulangi password baru"
            />
          </div>

          <div className="pt-1">
            <Button type="submit" loading={loading} size="sm">
              <Save className="w-4 h-4" />
              Simpan Password Baru
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 max-w-lg">
        <p className="text-xs text-amber-800 leading-relaxed">
          ⚠️ <strong>Penting:</strong> Jika ini adalah pertama kali Anda login menggunakan password default{' '}
          <code className="bg-amber-100 px-1 rounded">admin123</code>, segera ganti password Anda dengan
          password yang kuat dan unik.
        </p>
      </div>
    </div>
  )
}
