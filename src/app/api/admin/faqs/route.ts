import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ faqs })
}

const createSchema = z.object({
  question: z.string().min(5).max(500),
  answer: z.string().min(10).max(3000),
  category: z.string().max(100).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }

  const faq = await prisma.fAQ.create({
    data: {
      question: sanitizeString(parsed.data.question, 500),
      answer: sanitizeString(parsed.data.answer, 3000),
      category: parsed.data.category ? sanitizeString(parsed.data.category, 100) : null,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
    },
  })

  return NextResponse.json({ faq }, { status: 201 })
}
