import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  question: z.string().min(5).max(500).optional(),
  answer: z.string().min(10).max(3000).optional(),
  category: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })

  const faq = await prisma.fAQ.update({
    where: { id },
    data: {
      ...(parsed.data.question && { question: sanitizeString(parsed.data.question, 500) }),
      ...(parsed.data.answer && { answer: sanitizeString(parsed.data.answer, 3000) }),
      ...(parsed.data.category !== undefined && { category: parsed.data.category ? sanitizeString(parsed.data.category, 100) : null }),
      ...(parsed.data.isActive !== undefined && { isActive: parsed.data.isActive }),
      ...(parsed.data.sortOrder !== undefined && { sortOrder: parsed.data.sortOrder }),
    },
  })

  return NextResponse.json({ faq })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  await prisma.fAQ.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
