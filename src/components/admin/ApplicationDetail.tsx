'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Building2,
  FileText,
  History,
  MessageSquare,
  Upload,
  CheckCircle2,
  Plus,
} from 'lucide-react'
import { ApplicationStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { APPLICATION_STATUS_ORDER, APPLICATION_STATUS_LABELS, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import type { ApplicationStatus, DocumentType, DocumentStatus } from '@/lib/types'

interface Application {
  id: string
  code: string
  status: string
  submittedAt: string | Date
  updatedAt: string | Date
  adminNote: string | null
  internalNote: string | null
  customer: { id: string; name: string; whatsapp: string; email: string | null; city: string | null }
  business: {
    id: string; name: string; type: string; category: string
    address: string | null; productCount: number; productNames: string | null
    hasNIB: boolean; hasIngredientDocs: boolean
  }
  package: { id: string; name: string } | null
  statusHistory: Array<{ id: string; status: string; changedAt: string | Date; changedBy: string | null; note: string | null }>
  documents: Array<{
    id: string; type: string; fileName: string; fileSize: number
    mimeType: string; storedUrl: string | null; status: string; uploadedAt: string | Date; reviewNote: string | null
  }>
  notes: Array<{
    id: string; content: string; isPublic: boolean; createdAt: string | Date
    admin: { name: string; email: string } | null
  }>
}

interface Props {
  application: Application
  packages: Array<{ id: string; name: string }>
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ApplicationDetail({ application: initialApp }: Props) {
  const { success, error: toastError } = useToast()
  const [app, setApp] = useState(initialApp)

  // Form state
  const [newStatus, setNewStatus] = useState(app.status)
  const [adminNote, setAdminNote] = useState(app.adminNote || '')
  const [internalNote, setInternalNote] = useState(app.internalNote || '')
  const [noteContent, setNoteContent] = useState('')
  const [noteIsPublic, setNoteIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)

  async function saveUpdate() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/applications/${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus !== app.status ? newStatus : undefined,
          adminNote,
          internalNote,
          noteContent: noteContent.trim() || undefined,
          noteIsPublic,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        toastError('Gagal menyimpan', json.error)
        return
      }
      setApp(json.application)
      setNoteContent('')
      success('Tersimpan', 'Data pengajuan berhasil diperbarui')
    } catch {
      toastError('Kesalahan jaringan', 'Coba lagi')
    } finally {
      setSaving(false)
    }
  }

  async function reviewDocument(docId: string, status: string) {
    const res = await fetch(`/api/admin/documents/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const json = await res.json()
      setApp((prev) => ({
        ...prev,
        documents: prev.documents.map((d) => d.id === docId ? { ...d, ...json.document } : d),
      }))
      success('Status dokumen diperbarui')
    }
  }

  const docStatusColor: Record<string, string> = {
    UPLOADED: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    VALID: 'text-green-600 bg-green-50 border-green-200',
    NEEDS_REVISION: 'text-red-600 bg-red-50 border-red-200',
  }

  return (
    <div className="space-y-5 lg:pt-0 pt-14">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/applications"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-sm text-gray-400">{app.code}</span>
            <ApplicationStatusBadge status={app.status} />
          </div>
          <h1 className="font-bold text-gray-900 text-xl mt-0.5">{app.business.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-5">
          {/* Customer & Business info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Data Pelanggan
                </p>
                <dl className="space-y-2 text-sm">
                  {[
                    ['Nama', app.customer.name],
                    ['WhatsApp', app.customer.whatsapp],
                    ['Email', app.customer.email || '-'],
                    ['Kota', app.customer.city || '-'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-3">
                      <dt className="text-gray-400 w-20 flex-shrink-0">{k}</dt>
                      <dd className="font-medium text-gray-900 break-all">{v}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={`https://wa.me/${app.customer.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-green-600 font-medium hover:underline"
                >
                  Hubungi via WA →
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Data Usaha
                </p>
                <dl className="space-y-2 text-sm">
                  {[
                    ['Nama Usaha', app.business.name],
                    ['Jenis', app.business.type],
                    ['Kategori', app.business.category],
                    ['Jumlah Produk', `${app.business.productCount} produk`],
                    ['Punya NIB', app.business.hasNIB ? 'Ya' : 'Belum'],
                    ['Daftar Bahan', app.business.hasIngredientDocs ? 'Ada' : 'Belum'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-3">
                      <dt className="text-gray-400 w-28 flex-shrink-0 text-xs">{k}</dt>
                      <dd className="font-medium text-gray-900">{v}</dd>
                    </div>
                  ))}
                  {app.business.productNames && (
                    <div className="flex gap-3">
                      <dt className="text-gray-400 w-28 flex-shrink-0 text-xs">Produk</dt>
                      <dd className="font-medium text-gray-900 text-xs">{app.business.productNames}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Dokumen ({app.documents.length})
            </p>
            {app.documents.length === 0 ? (
              <p className="text-sm text-gray-400 py-3 text-center">Belum ada dokumen diunggah</p>
            ) : (
              <div className="space-y-3">
                {app.documents.map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {DOCUMENT_TYPE_LABELS[doc.type as DocumentType] ?? doc.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${docStatusColor[doc.status] ?? 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                          {DOCUMENT_STATUS_LABELS[doc.status as DocumentStatus] ?? doc.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{doc.fileName}</p>
                      <p className="text-xs text-gray-400">{formatFileSize(doc.fileSize)} · {formatDateTime(doc.uploadedAt)}</p>
                      {doc.storedUrl && (
                        <a
                          href={doc.storedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-0.5 inline-block"
                        >
                          Lihat dokumen →
                        </a>
                      )}
                      {doc.reviewNote && (
                        <p className="text-xs text-orange-700 bg-orange-50 rounded px-2 py-1 mt-1">{doc.reviewNote}</p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => reviewDocument(doc.id, 'VALID')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Tandai valid"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const note = prompt('Catatan revisi:')
                          if (note !== null) {
                            fetch(`/api/admin/documents/${doc.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'NEEDS_REVISION', reviewNote: note }),
                            }).then(() => reviewDocument(doc.id, 'NEEDS_REVISION'))
                          }
                        }}
                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Perlu revisi"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              Catatan
            </p>

            {/* Add note form */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
                placeholder="Tambahkan catatan..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none bg-white"
              />
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={noteIsPublic}
                    onChange={(e) => setNoteIsPublic(e.target.checked)}
                    className="rounded text-green-600"
                  />
                  Tampilkan ke pelanggan
                </label>
                <button
                  onClick={saveUpdate}
                  disabled={!noteContent.trim() || saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>
            </div>

            {app.notes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">Belum ada catatan</p>
            ) : (
              <div className="space-y-3">
                {app.notes.map((note) => (
                  <div key={note.id} className={`p-3 rounded-xl text-sm ${note.isPublic ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-500">
                        {note.admin?.name || 'Sistem'}
                        {note.isPublic && <span className="ml-2 text-blue-600 text-[10px] bg-blue-100 px-1.5 py-0.5 rounded">Publik</span>}
                      </span>
                      <span className="text-xs text-gray-400">{formatDateTime(note.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Update status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              Update Status
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {APPLICATION_STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s as ApplicationStatus]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Catatan untuk Pelanggan</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Pesan yang akan terlihat oleh pelanggan"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Catatan Internal (tidak terlihat pelanggan)</label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={2}
                  placeholder="Catatan untuk tim internal"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <Button onClick={saveUpdate} loading={saving} className="w-full" size="sm">
                Simpan Perubahan
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              Riwayat Status
            </p>
            <div className="space-y-3">
              {app.statusHistory.map((h, i) => (
                <div key={h.id} className="flex items-start gap-3 text-xs">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === app.statusHistory.length - 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <ApplicationStatusBadge status={h.status} />
                    <p className="text-gray-400 mt-0.5">{formatDateTime(h.changedAt)}</p>
                    {h.changedBy && <p className="text-gray-500">{h.changedBy}</p>}
                    {h.note && <p className="text-gray-500 mt-0.5">{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3">Informasi</p>
            <dl className="space-y-2 text-xs">
              <div className="flex gap-2">
                <dt className="text-gray-400 w-24 flex-shrink-0">Diajukan</dt>
                <dd className="text-gray-700">{formatDateTime(app.submittedAt)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-gray-400 w-24 flex-shrink-0">Diperbarui</dt>
                <dd className="text-gray-700">{formatDateTime(app.updatedAt)}</dd>
              </div>
              {app.package && (
                <div className="flex gap-2">
                  <dt className="text-gray-400 w-24 flex-shrink-0">Paket</dt>
                  <dd className="text-gray-700">{app.package.name}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
