'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface Certificate {
  id: string
  businessName: string
  productName: string | null
  year: number
  description: string | null
  imageUrl: string | null
  isActive: boolean
  sortOrder: number
}

interface CForm {
  businessName: string; productName: string; year: number
  description: string; isActive: boolean; sortOrder: number
}

const emptyForm: CForm = {
  businessName: '', productName: '', year: new Date().getFullYear(),
  description: '', isActive: true, sortOrder: 0,
}

export function CertificatesManager({ initialCertificates }: { initialCertificates: Certificate[] }) {
  const { success, error: toastError } = useToast()
  const [certs, setCerts] = useState(initialCertificates)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<CForm>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function startEdit(cert: Certificate) {
    setForm({ businessName: cert.businessName, productName: cert.productName || '', year: cert.year, description: cert.description || '', isActive: cert.isActive, sortOrder: cert.sortOrder })
    setImageFile(null)
    setImagePreview(cert.imageUrl)
    setEditing(cert.id)
    setShowForm(true)
  }

  function startCreate() {
    setForm(emptyForm); setImageFile(null); setImagePreview(null)
    setEditing(null); setShowForm(true)
  }

  function cancel() { setShowForm(false); setEditing(null); setImageFile(null); setImagePreview(null) }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function save() {
    if (!form.businessName.trim()) { toastError('Nama usaha wajib diisi'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('businessName', form.businessName)
      if (form.productName) fd.append('productName', form.productName)
      fd.append('year', String(form.year))
      if (form.description) fd.append('description', form.description)
      fd.append('isActive', String(form.isActive))
      fd.append('sortOrder', String(form.sortOrder))
      if (imageFile) fd.append('image', imageFile)

      const url = editing ? `/api/admin/certificates/${editing}` : '/api/admin/certificates'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, body: fd })
      const json = await res.json()
      if (!res.ok) { toastError('Gagal menyimpan', json.error); return }

      if (editing) {
        setCerts((c) => c.map((x) => x.id === editing ? json.certificate : x))
      } else {
        setCerts((c) => [...c, json.certificate])
      }
      success(editing ? 'Sertifikat diperbarui' : 'Sertifikat ditambahkan')
      cancel()
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(cert: Certificate) {
    const res = await fetch(`/api/admin/certificates/${cert.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !cert.isActive }),
    })
    if (res.ok) setCerts((c) => c.map((x) => x.id === cert.id ? { ...x, isActive: !x.isActive } : x))
  }

  async function deleteCert(id: string) {
    if (!confirm('Hapus sertifikat ini?')) return
    const res = await fetch(`/api/admin/certificates/${id}`, { method: 'DELETE' })
    if (res.ok) { setCerts((c) => c.filter((x) => x.id !== id)); success('Sertifikat dihapus') }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={startCreate} size="sm"><Plus className="w-4 h-4" /> Tambah Sertifikat</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-5">{editing ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Usaha *</label>
              <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nama usaha" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Produk</label>
              <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nama produk (opsional)" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tahun *</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} min={2000} max={2099}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Urutan</label>
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Deskripsi opsional" />
            </div>
            {/* Image upload */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Gambar Sertifikat</label>
              <div className="flex items-start gap-4">
                <div className="relative w-28 h-20 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" sizes="112px" unoptimized />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BadgeCheck className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange}
                    className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP. Maks. 5 MB.</p>
                  <p className="text-xs text-orange-600 mt-1 font-medium">⚠️ Jangan upload gambar yang mengandung data pribadi sensitif.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded text-green-600" />
                Tampilkan di website
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button onClick={save} loading={saving} size="sm"><Save className="w-4 h-4" /> Simpan</Button>
            <Button variant="ghost" onClick={cancel} size="sm"><X className="w-4 h-4" /> Batal</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert) => (
          <div key={cert.id} className={`bg-white rounded-2xl border overflow-hidden ${cert.isActive ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'}`}>
            <div className="relative h-36 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
              {cert.imageUrl ? (
                <Image src={cert.imageUrl} alt={cert.businessName} fill className="object-cover" sizes="300px" />
              ) : (
                <BadgeCheck className="w-10 h-10 text-purple-200" />
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => toggleActive(cert)} className="p-1.5 bg-white/80 rounded-lg text-gray-500 hover:text-gray-700">
                  {cert.isActive ? <ToggleRight className="w-3.5 h-3.5 text-green-600" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => startEdit(cert)} className="p-1.5 bg-white/80 rounded-lg text-gray-500 hover:text-blue-600">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteCert(cert.id)} className="p-1.5 bg-white/80 rounded-lg text-gray-500 hover:text-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold text-gray-900 text-sm">{cert.businessName}</p>
              {cert.productName && <p className="text-xs text-gray-500 mt-0.5">{cert.productName}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">{cert.year}</span>
                <span className="text-xs text-green-600 font-semibold">✓ Tersertifikasi</span>
              </div>
            </div>
          </div>
        ))}
        {certs.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
            <BadgeCheck className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Belum ada sertifikat. Klik tombol di atas untuk menambahkan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
