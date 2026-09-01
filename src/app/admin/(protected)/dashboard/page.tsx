import { prisma } from '@/lib/prisma'
import { ApplicationStatusBadge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils'
import { FileText, Clock, CheckCircle2, BarChart3, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const [totalApplications, pendingApplications, completedApplications, recentApplications, statusCounts] =
    await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: { not: 'SELESAI' } } }),
      prisma.application.count({ where: { status: 'SELESAI' } }),
      prisma.application.findMany({
        take: 8,
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true, code: true, status: true, submittedAt: true,
          customer: { select: { name: true } },
          business: { select: { name: true } },
        },
      }),
      prisma.application.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ])

  return { totalApplications, pendingApplications, completedApplications, recentApplications, statusCounts }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const stats = [
    { label: 'Total Pengajuan', value: data.totalApplications, icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Sedang Diproses', value: data.pendingApplications, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Selesai', value: data.completedApplications, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="space-y-6 lg:pt-0 pt-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Ringkasan aktivitas pendampingan sertifikasi halal</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-gray-400" />
            Distribusi Status
          </h2>
        </div>
        <div className="space-y-3">
          {data.statusCounts.map(({ status, _count }) => {
            const pct = data.totalApplications > 0 ? Math.round((_count.status / data.totalApplications) * 100) : 0
            return (
              <div key={status} className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0">
                  <ApplicationStatusBadge status={status} />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-0">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-8 text-right">{_count.status}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Pengajuan Terbaru</h2>
          <Link
            href="/admin/applications"
            className="flex items-center gap-1 text-sm text-green-600 font-medium hover:text-green-700 transition-colors"
          >
            Lihat semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="space-y-3">
          {data.recentApplications.map((app) => (
            <Link
              key={app.id}
              href={`/admin/applications/${app.id}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-mono text-xs text-gray-400">{app.code}</p>
                  <ApplicationStatusBadge status={app.status} />
                </div>
                <p className="font-medium text-gray-900 text-sm truncate">{app.business.name}</p>
                <p className="text-xs text-gray-400">{app.customer.name}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">{formatDateTime(app.submittedAt)}</p>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-green-500 transition-colors ml-auto mt-1" />
              </div>
            </Link>
          ))}
          {data.recentApplications.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada pengajuan</p>
          )}
        </div>
      </div>
    </div>
  )
}
