import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const schema = z.object({
  status: z.enum(['UPLOADED', 'NEEDS_REVISION', 'VALID']),
  reviewNote: z.string().max(500).optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })

  const doc = await prisma.document.update({
    where: { id },
    data: {
      status: parsed.data.status,
      reviewNote: parsed.data.reviewNote ? sanitizeString(parsed.data.reviewNote, 500) : null,
      reviewedAt: new Date(),
    },
  })

  return NextResponse.json({ document: doc })
}
