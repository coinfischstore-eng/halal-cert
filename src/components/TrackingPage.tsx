'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Phone,
  FileText,
  Upload,
  RefreshCw,
} from 'lucide-react'
import { ApplicationStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_ORDER, DOCUMENT_TYPE_LABELS, getWhatsAppUrl } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import type { ApplicationStatus } from '@/lib/types'

interface TrackResult {
  id: string
  code: string
  status: string
  submittedAt: string
  updatedAt: string
  adminNote: string | null
  customer: { name: string; whatsapp: string }
  business: { name: string; type: string; category: string; productCount: number }
  package: { name: string } | null
  statusHistory: Array<{ status: string; changedAt: string; note: string | null }>
  notes: Array<{ content: string; createdAt: string }>
}

function StatusTimeline({ current, history }: { current: string; history: TrackResult['statusHistory'] }) {
  const statusSet = new Set(history.map((h) => h.status))

  return (
    <div className="space-y-0">
      {APPLICATION_STATUS_ORDER.map((s, i) => {
        const done = statusSet.has(s)
        const isActive = current === s
        const historyEntry = history.find((h) => h.status === s)
        const isLast = i === APPLICATION_STATUS_ORDER.length - 1

        return (
          <div key={s} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  done && isActive
                    ? 'bg-green-600 text-white ring-4 ring-green-100'
                    : done
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isActive ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </div>
              {!isLast && (
                <div className={`w-0.5 h-8 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="pb-6 flex-1 min-w-0">
              <p className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                {APPLICATION_STATUS_LABELS[s]}
              </p>
              {historyEntry && (
                <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(historyEntry.changedAt)}</p>
              )}
              {historyEntry?.note && (
                <p className="text-xs text-gray-500 mt-1 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                  {historyEntry.note}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function TrackingForm({ onResult }: { onResult: (data: TrackResult) => void }) {
  const searchParams = useSearchParams()
  const { error: toastError } = useToast()
  const [code, setCode] = useState(searchParams.get('code') || '')
  const [wa, setWa] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !wa.trim()) {
      toastError('Form tidak lengkap', 'Isi kode pengajuan dan nomor WhatsApp')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/applications/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), whatsapp: wa.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        toastError('Tidak ditemukan', json.error || 'Data tidak ditemukan')
        return
      }
      onResult(json.application)
    } catch {
      toastError('Kesalahan jaringan', 'Periksa koneksi internet Anda')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Kode Pengajuan <span className="text-red-500">*</span>
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Contoh: HALAL-2026-00001"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono tracking-wide"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Nomor WhatsApp <span className="text-red-500">*</span>
        </label>
        <input
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          placeholder="Nomor yang didaftarkan"
          type="tel"
          className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-400">Gunakan nomor WhatsApp yang sama saat pendaftaran.</p>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        <Search className="w-4 h-4" />
        {loading ? 'Mencari...' : 'Cek Status Pengajuan'}
      </Button>
    </form>
  )
}

function UploadDocumentForm({ code, whatsapp, onSuccess }: { code: string; whatsapp: string; onSuccess: () => void }) {
  const { success, error: toastError } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('OTHER')
  const [uploading, setUploading] = useState(false)

  const docTypes = Object.entries(DOCUMENT_TYPE_LABELS)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('code', code)
      fd.append('whatsapp', whatsapp)
      fd.append('documentType', docType)
      fd.append('file', file)

      const res = await fetch('/api/documents/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) {
        toastError('Upload gagal', json.error || 'Terjadi kesalahan')
        return
      }
      success('Dokumen berhasil diunggah')
      setFile(null)
      onSuccess()
    } catch {
      toastError('Kesalahan jaringan', 'Periksa koneksi internet Anda')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Upload className="w-4 h-4 text-green-600" />
        Unggah Dokumen
      </p>
      <select
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {docTypes.map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all"
      />
      <p className="text-xs text-gray-400">Format: JPG, PNG, WebP, PDF. Maks. 5 MB.</p>
      <Button type="submit" disabled={!file} loading={uploading} size="sm" className="w-full">
        <Upload className="w-3.5 h-3.5" />
        {uploading ? 'Mengunggah...' : 'Unggah Dokumen'}
      </Button>
    </form>
  )
}

function TrackingResult({ data, onReset }: { data: TrackResult; onReset: () => void }) {
  const [showUpload, setShowUpload] = useState(false)

  const waMsg = `Halo, saya ingin menanyakan perkembangan pengajuan saya.\n\nKode Pengajuan: ${data.code}\nNama: ${data.customer.name}\nStatus: ${APPLICATION_STATUS_LABELS[data.status as ApplicationStatus] ?? data.status}\n\nMohon informasinya. Terima kasih.`

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 font-mono">{data.code}</p>
          <h3 className="font-bold text-gray-900 text-lg">{data.business.name}</h3>
          <p className="text-sm text-gray-500">{data.customer.name}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ApplicationStatusBadge status={data.status} />
          <button
            onClick={onReset}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Cari lain
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-0.5">Diajukan</p>
          <p className="font-medium text-gray-900">{formatDateTime(data.submittedAt)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-0.5">Terakhir Update</p>
          <p className="font-medium text-gray-900">{formatDateTime(data.updatedAt)}</p>
        </div>
      </div>

      {/* Admin note (if any) */}
      {data.adminNote && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Catatan dari Tim
          </p>
          <p className="text-sm text-blue-800">{data.adminNote}</p>
        </div>
      )}

      {/* Public notes */}
      {data.notes.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Catatan Terbaru:</p>
          {data.notes.map((note, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-sm text-gray-600">{note.content}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(note.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-4">Riwayat Status:</p>
        <StatusTimeline current={data.status} history={data.statusHistory} />
      </div>

      {/* Upload */}
      {data.status !== 'SELESAI' && (
        <div>
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="flex items-center gap-2 text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {showUpload ? 'Tutup Form Upload' : 'Unggah Dokumen'}
          </button>
          {showUpload && (
            <div className="mt-3">
              <UploadDocumentForm
                code={data.code}
                whatsapp={data.customer.whatsapp}
                onSuccess={() => setShowUpload(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* WA contact */}
      <div className="pt-4 border-t border-gray-100">
        <a
          href={getWhatsAppUrl(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          Tanya Tim via WhatsApp
        </a>
      </div>
    </div>
  )
}

function TrackingContent() {
  const [result, setResult] = useState<TrackResult | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {!result ? (
        <TrackingForm onResult={setResult} />
      ) : (
        <TrackingResult data={result} onReset={() => setResult(null)} />
      )}
    </div>
  )
}

export function TrackingPage() {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">Memuat...</div>}>
      <TrackingContent />
    </Suspense>
  )
}
