import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (status) {
    where.status = status
  }

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
        id: true,
        code: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
        customer: { select: { name: true, whatsapp: true } },
        business: { select: { name: true, category: true, productCount: true } },
        package: { select: { name: true } },
        _count: { select: { documents: true } },
      },
    }),
    prisma.application.count({ where }),
  ])

  return NextResponse.json({
    applications,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}
