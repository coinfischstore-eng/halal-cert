'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Star, ToggleLeft, ToggleRight, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface Package {
  id: string
  name: string
  slug: string
  description: string
  price: number
  priceLabel: string | null
  features: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
}

interface PackageForm {
  name: string
  slug: string
  description: string
  priceLabel: string
  features: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
}

const emptyForm: PackageForm = {
  name: '', slug: '', description: '', priceLabel: 'Hubungi Kami',
  features: '', isActive: true, isFeatured: false, sortOrder: 0,
}

export function PackagesManager({ initialPackages }: { initialPackages: Package[] }) {
  const { success, error: toastError } = useToast()
  const [packages, setPackages] = useState(initialPackages)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<PackageForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  function startEdit(pkg: Package) {
    setForm({
      name: pkg.name, slug: pkg.slug, description: pkg.description,
      priceLabel: pkg.priceLabel || 'Hubungi Kami',
      features: (JSON.parse(pkg.features || '[]') as string[]).join('\n'),
      isActive: pkg.isActive, isFeatured: pkg.isFeatured, sortOrder: pkg.sortOrder,
    })
    setEditing(pkg.id)
    setShowForm(true)
  }

  function startCreate() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  function cancel() {
    setShowForm(false)
    setEditing(null)
  }

  async function save() {
    setSaving(true)
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
        price: 0,
      }
      const url = editing ? `/api/admin/packages/${editing}` : '/api/admin/packages'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) { toastError('Gagal menyimpan', json.error); return }

      if (editing) {
        setPackages((p) => p.map((pkg) => pkg.id === editing ? json.package : pkg))
      } else {
        setPackages((p) => [...p, json.package])
      }
      success(editing ? 'Paket diperbarui' : 'Paket ditambahkan')
      cancel()
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(pkg: Package) {
    const res = await fetch(`/api/admin/packages/${pkg.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !pkg.isActive }),
    })
    if (res.ok) {
      setPackages((p) => p.map((x) => x.id === pkg.id ? { ...x, isActive: !x.isActive } : x))
    }
  }

  async function deletePackage(id: string) {
    if (!confirm('Hapus paket ini?')) return
    const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPackages((p) => p.filter((x) => x.id !== id))
      success('Paket dihapus')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={startCreate} size="sm">
          <Plus className="w-4 h-4" />
          Tambah Paket
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-5">{editing ? 'Edit Paket' : 'Tambah Paket'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Paket *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="Nama paket" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="input-field" placeholder="nama-paket" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi *</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2} className="input-field resize-none" placeholder="Deskripsi singkat paket" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Label Harga</label>
              <input value={form.priceLabel} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
                className="input-field" placeholder="Hubungi Kami" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Urutan</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Fitur (satu per baris)</label>
              <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                rows={5} className="input-field resize-none font-mono text-xs" placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded text-green-600" />
                Aktif
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded text-green-600" />
                Populer
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button onClick={save} loading={saving} size="sm">
              <Save className="w-4 h-4" />
              Simpan
            </Button>
            <Button variant="ghost" onClick={cancel} size="sm">
              <X className="w-4 h-4" />
              Batal
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`bg-white rounded-2xl border p-5 ${pkg.isActive ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{pkg.name}</h3>
                  {pkg.isFeatured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                </div>
                <p className="text-xs text-green-600 font-medium mt-0.5">{pkg.priceLabel || 'Hubungi Kami'}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleActive(pkg)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors" title={pkg.isActive ? 'Nonaktifkan' : 'Aktifkan'}>
                  {pkg.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(pkg)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deletePackage(pkg.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{pkg.description}</p>
            <ul className="space-y-1">
              {(JSON.parse(pkg.features || '[]') as string[]).slice(0, 3).map((f) => (
                <li key={f} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-green-500 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.15s;
        }
        .input-field:focus {
          border-color: transparent;
          box-shadow: 0 0 0 2px #22c55e;
        }
      `}</style>
    </div>
  )
}
