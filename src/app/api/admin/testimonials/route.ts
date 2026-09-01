import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { saveUploadedFile, validateImageFile } from '@/lib/storage'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json({ testimonials })
}

const createSchema = z.object({
  name: z.string().min(2).max(100),
  businessName: z.string().max(200).optional(),
  businessType: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  content: z.string().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
})

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const ct = req.headers.get('content-type') || ''
  let body: Record<string, unknown> = {}
  let photoUrl: string | undefined

  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData()
    body = {
      name: fd.get('name'),
      businessName: fd.get('businessName'),
      businessType: fd.get('businessType'),
      location: fd.get('location'),
      content: fd.get('content'),
      rating: fd.get('rating'),
      isActive: fd.get('isActive') !== 'false',
      sortOrder: fd.get('sortOrder') ?? '0',
    }
    const photoFile = fd.get('photo') as File | null
    if (photoFile && photoFile.size > 0) {
      const err = validateImageFile(photoFile)
      if (err) return NextResponse.json({ error: err }, { status: 400 })
      photoUrl = await saveUploadedFile(photoFile, 'testimonials')
    }
  } else {
    body = await req.json()
  }

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })

  const testimonial = await prisma.testimonial.create({
    data: {
      name: sanitizeString(parsed.data.name, 100),
      businessName: parsed.data.businessName ? sanitizeString(parsed.data.businessName, 200) : null,
      businessType: parsed.data.businessType ? sanitizeString(parsed.data.businessType, 100) : null,
      location: parsed.data.location ? sanitizeString(parsed.data.location, 100) : null,
      content: sanitizeString(parsed.data.content, 2000),
      rating: parsed.data.rating,
      photoUrl: photoUrl ?? null,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
    },
  })

  return NextResponse.json({ testimonial }, { status: 201 })
}
