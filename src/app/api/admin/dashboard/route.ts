import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const [
    totalApplications,
    pendingApplications,
    completedApplications,
    recentApplications,
    statusCounts,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({
      where: { status: { not: 'SELESAI' } },
    }),
    prisma.application.count({ where: { status: 'SELESAI' } }),
    prisma.application.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true,
        code: true,
        status: true,
        submittedAt: true,
        customer: { select: { name: true } },
        business: { select: { name: true } },
      },
    }),
    prisma.application.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ])

  return NextResponse.json({
    stats: {
      totalApplications,
      pendingApplications,
      completedApplications,
    },
    recentApplications,
    statusCounts,
  })
}
