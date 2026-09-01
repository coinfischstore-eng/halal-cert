'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, ArrowRight, FileText, X } from 'lucide-react'
import { ApplicationStatusBadge } from '@/components/ui/Badge'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_ORDER } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'

interface Application {
  id: string
  code: string
  status: string
  submittedAt: string | Date
  updatedAt: string | Date
  customer: { name: string; whatsapp: string }
  business: { name: string; category: string; productCount: number }
  package: { name: string } | null
  _count: { documents: number }
}

interface Props {
  applications: Application[]
  pagination: { page: number; total: number; pages: number }
  search: string
  status: string
}

export function ApplicationsTable({ applications, pagination, search: initSearch, status: initStatus }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(initSearch)
  const [status, setStatus] = useState(initStatus)

  const updateParams = useCallback(
    (newSearch: string, newStatus: string, newPage = 1) => {
      const params = new URLSearchParams()
      if (newSearch) params.set('search', newSearch)
      if (newStatus) params.set('status', newStatus)
      if (newPage > 1) params.set('page', String(newPage))
      router.push(`/admin/applications?${params.toString()}`)
    },
    [router]
  )

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateParams(search, status)
  }

  function handleStatusChange(s: string) {
    setStatus(s)
    updateParams(search, s)
  }

  function clearFilters() {
    setSearch('')
    setStatus('')
    router.push('/admin/applications')
  }

  const hasFilters = !!initSearch || !!initStatus

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode, nama, WhatsApp, usaha..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Semua Status</option>
              {APPLICATION_STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                title="Hapus filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Tidak ada pengajuan</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-2 text-sm text-green-600 hover:underline">
                Hapus filter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kode</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pelanggan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Usaha</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Tanggal</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Dok.</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gray-500">{app.code}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-gray-900">{app.customer.name}</p>
                      <p className="text-xs text-gray-400">{app.customer.whatsapp}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-gray-900">{app.business.name}</p>
                      <p className="text-xs text-gray-400">{app.business.category}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-gray-500">{formatDateTime(app.submittedAt)}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{app._count.documents}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
          <p className="text-sm text-gray-500">
            Halaman {pagination.page} dari {pagination.pages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            {pagination.page > 1 && (
              <button
                onClick={() => updateParams(search, status, pagination.page - 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sebelumnya
              </button>
            )}
            {pagination.page < pagination.pages && (
              <button
                onClick={() => updateParams(search, status, pagination.page + 1)}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Berikutnya
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
