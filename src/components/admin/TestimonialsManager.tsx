'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface Testimonial {
  id: string
  name: string
  businessName: string | null
  businessType: string | null
  location: string | null
  content: string
  rating: number
  photoUrl: string | null
  isActive: boolean
  sortOrder: number
}

interface TForm {
  name: string; businessName: string; businessType: string; location: string
  content: string; rating: number; isActive: boolean; sortOrder: number
}

const emptyForm: TForm = {
  name: '', businessName: '', businessType: '', location: '',
  content: '', rating: 5, isActive: true, sortOrder: 0,
}

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const { success, error: toastError } = useToast()
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<TForm>(emptyForm)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function startEdit(t: Testimonial) {
    setForm({ name: t.name, businessName: t.businessName || '', businessType: t.businessType || '', location: t.location || '', content: t.content, rating: t.rating, isActive: t.isActive, sortOrder: t.sortOrder })
    setPhotoFile(null)
    setPhotoPreview(t.photoUrl)
    setEditing(t.id)
    setShowForm(true)
  }

  function startCreate() {
    setForm(emptyForm); setPhotoFile(null); setPhotoPreview(null)
    setEditing(null); setShowForm(true)
  }

  function cancel() { setShowForm(false); setEditing(null); setPhotoFile(null); setPhotoPreview(null) }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function save() {
    if (!form.name.trim() || !form.content.trim()) { toastError('Lengkapi data', 'Nama dan konten wajib diisi'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      if (form.businessName) fd.append('businessName', form.businessName)
      if (form.businessType) fd.append('businessType', form.businessType)
      if (form.location) fd.append('location', form.location)
      fd.append('content', form.content)
      fd.append('rating', String(form.rating))
      fd.append('isActive', String(form.isActive))
      fd.append('sortOrder', String(form.sortOrder))
      if (photoFile) fd.append('photo', photoFile)

      const url = editing ? `/api/admin/testimonials/${editing}` : '/api/admin/testimonials'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, body: fd })
      const json = await res.json()
      if (!res.ok) { toastError('Gagal', json.error); return }
      if (editing) {
        setTestimonials((t) => t.map((x) => x.id === editing ? json.testimonial : x))
      } else {
        setTestimonials((t) => [...t, json.testimonial])
      }
      success(editing ? 'Testimoni diperbarui' : 'Testimoni ditambahkan')
      cancel()
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(t: Testimonial) {
    const res = await fetch(`/api/admin/testimonials/${t.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !t.isActive }),
    })
    if (res.ok) setTestimonials((prev) => prev.map((x) => x.id === t.id ? { ...x, isActive: !x.isActive } : x))
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Hapus testimoni ini?')) return
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    if (res.ok) { setTestimonials((t) => t.filter((x) => x.id !== id)); success('Testimoni dihapus') }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={startCreate} size="sm"><Plus className="w-4 h-4" /> Tambah Testimoni</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-5">{editing ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nama pelanggan" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Usaha</label>
              <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Nama usaha (opsional)" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Jenis Usaha</label>
              <input value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Makanan & Minuman" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Lokasi</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Kota / Kabupaten" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Rating</label>
              <div className="flex gap-1 pt-1">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}>
                    <Star className={`w-6 h-6 ${s <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            {/* Photo upload */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Foto Profil</label>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Preview" fill className="object-cover" sizes="56px" unoptimized />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xl text-gray-400">{form.name.charAt(0) || '?'}</span>
                    </div>
                  )}
                </div>
                <div>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange}
                    className="w-full text-xs text-gray-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP. Maks. 5 MB.</p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Konten Testimoni *</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Isi testimoni" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded text-green-600" />
                Tampilkan
              </label>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Urutan</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button onClick={save} loading={saving} size="sm"><Save className="w-4 h-4" /> Simpan</Button>
            <Button variant="ghost" onClick={cancel} size="sm"><X className="w-4 h-4" /> Batal</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className={`bg-white rounded-2xl border p-5 ${t.isActive ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'}`}>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleActive(t)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  {t.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(t)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteTestimonial(t.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.content}&rdquo;</p>
            <div className="flex items-center gap-2.5">
              {t.photoUrl ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-green-100">
                  <Image src={t.photoUrl} alt={t.name} fill className="object-cover" sizes="32px" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold text-xs">{t.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400">{[t.businessName, t.location].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-sm">Belum ada testimoni.</p>
          </div>
        )}
      </div>
    </div>
  )
}
