'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string | null
  isActive: boolean
  sortOrder: number
}

interface FAQForm {
  question: string
  answer: string
  category: string
  isActive: boolean
  sortOrder: number
}

const emptyForm: FAQForm = { question: '', answer: '', category: 'Umum', isActive: true, sortOrder: 0 }

export function FAQsManager({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const { success, error: toastError } = useToast()
  const [faqs, setFaqs] = useState(initialFaqs)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FAQForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  function startEdit(faq: FAQ) {
    setForm({ question: faq.question, answer: faq.answer, category: faq.category || 'Umum', isActive: faq.isActive, sortOrder: faq.sortOrder })
    setEditing(faq.id)
    setShowForm(true)
  }

  function startCreate() {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  function cancel() { setShowForm(false); setEditing(null) }

  async function save() {
    if (!form.question.trim() || !form.answer.trim()) {
      toastError('Lengkapi data', 'Pertanyaan dan jawaban wajib diisi')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/admin/faqs/${editing}` : '/api/admin/faqs'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) { toastError('Gagal', json.error); return }
      if (editing) {
        setFaqs((f) => f.map((x) => x.id === editing ? json.faq : x))
      } else {
        setFaqs((f) => [...f, json.faq])
      }
      success(editing ? 'FAQ diperbarui' : 'FAQ ditambahkan')
      cancel()
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(faq: FAQ) {
    const res = await fetch(`/api/admin/faqs/${faq.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !faq.isActive }),
    })
    if (res.ok) setFaqs((f) => f.map((x) => x.id === faq.id ? { ...x, isActive: !x.isActive } : x))
  }

  async function deleteFaq(id: string) {
    if (!confirm('Hapus FAQ ini?')) return
    const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    if (res.ok) { setFaqs((f) => f.filter((x) => x.id !== id)); success('FAQ dihapus') }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={startCreate} size="sm"><Plus className="w-4 h-4" /> Tambah FAQ</Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-5">{editing ? 'Edit FAQ' : 'Tambah FAQ'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Pertanyaan *</label>
              <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Isi pertanyaan" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Jawaban *</label>
              <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={5} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Isi jawaban" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kategori</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Umum" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Urutan</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded text-green-600" />
                  Aktif
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button onClick={save} loading={saving} size="sm"><Save className="w-4 h-4" /> Simpan</Button>
            <Button variant="ghost" onClick={cancel} size="sm"><X className="w-4 h-4" /> Batal</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className={`bg-white rounded-2xl border ${faq.isActive ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'}`}>
            <div
              className="flex items-center gap-3 p-4 cursor-pointer"
              onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{faq.question}</p>
                {faq.category && <span className="text-xs text-gray-400">{faq.category}</span>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={(e) => { e.stopPropagation(); toggleActive(faq) }} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  {faq.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); startEdit(faq) }} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteFaq(faq.id) }} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                {expanded === faq.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
            {expanded === faq.id && (
              <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-sm">Belum ada FAQ. Klik tombol di atas untuk menambahkan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
