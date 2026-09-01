import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { saveUploadedFile, validateImageFile } from '@/lib/storage'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  businessName: z.string().min(2).max(200).optional(),
  productName: z.string().max(200).optional(),
  year: z.coerce.number().int().min(2000).max(2099).optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  // Support both JSON and FormData
  let imageUrl: string | undefined
  let body: Record<string, unknown> = {}

  const ct = req.headers.get('content-type') || ''
  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData()
    body = {
      businessName: fd.get('businessName'),
      productName: fd.get('productName'),
      year: fd.get('year'),
      description: fd.get('description'),
      isActive: fd.get('isActive') !== 'false',
      sortOrder: fd.get('sortOrder'),
    }
    const imageFile = fd.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      const err = validateImageFile(imageFile)
      if (err) return NextResponse.json({ error: err }, { status: 400 })
      imageUrl = await saveUploadedFile(imageFile, 'certificates')
    }
  } else {
    body = await req.json()
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })

  const d = parsed.data
  const cert = await prisma.certificate.update({
    where: { id },
    data: {
      ...(d.businessName && { businessName: sanitizeString(d.businessName, 200) }),
      ...(d.productName !== undefined && { productName: d.productName ? sanitizeString(d.productName, 200) : null }),
      ...(d.year !== undefined && { year: d.year }),
      ...(d.description !== undefined && { description: d.description ? sanitizeString(d.description, 1000) : null }),
      ...(d.isActive !== undefined && { isActive: d.isActive }),
      ...(d.sortOrder !== undefined && { sortOrder: d.sortOrder }),
      ...(imageUrl && { imageUrl }),
    },
  })

  return NextResponse.json({ certificate: cert })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  await prisma.certificate.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
