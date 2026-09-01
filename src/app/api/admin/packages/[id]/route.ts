import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  price: z.number().int().min(0).optional(),
  priceLabel: z.string().max(100).optional().nullable(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })

  const d = parsed.data
  const pkg = await prisma.package.update({
    where: { id },
    data: {
      ...(d.name && { name: sanitizeString(d.name, 100) }),
      ...(d.description && { description: sanitizeString(d.description, 1000) }),
      ...(d.price !== undefined && { price: d.price }),
      ...(d.priceLabel !== undefined && { priceLabel: d.priceLabel }),
      ...(d.features && { features: JSON.stringify(d.features) }),
      ...(d.isActive !== undefined && { isActive: d.isActive }),
      ...(d.isFeatured !== undefined && { isFeatured: d.isFeatured }),
      ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
    },
  })

  return NextResponse.json({ package: pkg })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  await prisma.package.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
