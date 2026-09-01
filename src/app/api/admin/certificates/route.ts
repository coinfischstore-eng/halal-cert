import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { saveUploadedFile, validateImageFile } from '@/lib/storage'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

// GET all certificates (admin)
export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const certs = await prisma.certificate.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json({ certificates: certs })
}

const createSchema = z.object({
  businessName: z.string().min(2).max(200),
  productName: z.string().max(200).optional(),
  year: z.coerce.number().int().min(2000).max(2099),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
})

// POST create certificate (with optional image upload)
export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const formData = await req.formData()
  const body = {
    businessName: formData.get('businessName'),
    productName: formData.get('productName'),
    year: formData.get('year'),
    description: formData.get('description'),
    isActive: formData.get('isActive') !== 'false',
    sortOrder: formData.get('sortOrder') ?? '0',
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validasi gagal', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  let imageUrl: string | undefined
  const imageFile = formData.get('image') as File | null
  if (imageFile && imageFile.size > 0) {
    const err = validateImageFile(imageFile)
    if (err) return NextResponse.json({ error: err }, { status: 400 })
    imageUrl = await saveUploadedFile(imageFile, 'certificates')
  }

  const cert = await prisma.certificate.create({
    data: {
      businessName: sanitizeString(parsed.data.businessName, 200),
      productName: parsed.data.productName ? sanitizeString(parsed.data.productName, 200) : null,
      year: parsed.data.year,
      description: parsed.data.description ? sanitizeString(parsed.data.description, 1000) : null,
      imageUrl: imageUrl ?? null,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
    },
  })

  return NextResponse.json({ certificate: cert }, { status: 201 })
}
