import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { saveUploadedFile, validateImageFile } from '@/lib/storage'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  businessName: z.string().max(200).optional(),
  businessType: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  content: z.string().min(10).max(2000).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

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
      sortOrder: fd.get('sortOrder'),
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

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })

  const d = parsed.data
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      ...(d.name && { name: sanitizeString(d.name, 100) }),
      ...(d.businessName !== undefined && { businessName: d.businessName ? sanitizeString(d.businessName, 200) : null }),
      ...(d.businessType !== undefined && { businessType: d.businessType ? sanitizeString(d.businessType, 100) : null }),
      ...(d.location !== undefined && { location: d.location ? sanitizeString(d.location, 100) : null }),
      ...(d.content && { content: sanitizeString(d.content, 2000) }),
      ...(d.rating !== undefined && { rating: d.rating }),
      ...(d.isActive !== undefined && { isActive: d.isActive }),
      ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
      ...(photoUrl && { photoUrl }),
    },
  })

  return NextResponse.json({ testimonial })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  await prisma.testimonial.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
