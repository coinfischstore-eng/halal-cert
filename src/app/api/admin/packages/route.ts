import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const packages = await prisma.package.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ packages })
}

const createSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  description: z.string().min(10).max(1000),
  price: z.number().int().min(0).default(0),
  priceLabel: z.string().max(100).optional(),
  features: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
})

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validasi gagal', issues: parsed.error.flatten() }, { status: 400 })

  const pkg = await prisma.package.create({
    data: {
      name: sanitizeString(parsed.data.name, 100),
      slug: parsed.data.slug,
      description: sanitizeString(parsed.data.description, 1000),
      price: parsed.data.price,
      priceLabel: parsed.data.priceLabel || null,
      features: JSON.stringify(parsed.data.features),
      isActive: parsed.data.isActive,
      isFeatured: parsed.data.isFeatured,
      sortOrder: parsed.data.sortOrder,
    },
  })

  return NextResponse.json({ package: pkg }, { status: 201 })
}
