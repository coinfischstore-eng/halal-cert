import { prisma } from '@/lib/prisma'
import { ApplicationsTable } from '@/components/admin/ApplicationsTable'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pengajuan - Admin HalalPro' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}

export default async function ApplicationsPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, parseInt(sp.page || '1'))
  const search = sp.search || ''
  const status = sp.status || ''
  const limit = 20
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { code: { contains: search } },
      { customer: { name: { contains: search } } },
      { customer: { whatsapp: { contains: search } } },
      { business: { name: { contains: search } } },
    ]
  }

  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true, code: true, status: true, submittedAt: true, updatedAt: true,
        customer: { select: { name: true, whatsapp: true } },
        business: { select: { name: true, category: true, productCount: true } },
        package: { select: { name: true } },
        _count: { select: { documents: true } },
      },
    }),
    prisma.application.count({ where }),
  ])

  return (
    <div className="space-y-5 lg:pt-0 pt-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengajuan</h1>
        <p className="text-sm text-gray-500 mt-1">Total {total} pengajuan</p>
      </div>
      <ApplicationsTable
        applications={applications}
        pagination={{ page, total, pages: Math.ceil(total / limit) }}
        search={search}
        status={status}
      />
    </div>
  )
}
