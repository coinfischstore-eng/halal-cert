import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateApplicationCode, normalizeWhatsApp, sanitizeString } from '@/lib/utils'
import { BUSINESS_TYPES, BUSINESS_CATEGORIES } from '@/lib/types'
import { z } from 'zod'

const schema = z.object({
  // Customer
  customerName: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  whatsapp: z.string().min(9, 'Nomor WhatsApp tidak valid'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  // Business
  businessName: z.string().min(2, 'Nama usaha minimal 2 karakter').max(200),
  businessType: z.string().min(1, 'Pilih jenis usaha'),
  businessCategory: z.string().min(1, 'Pilih kategori usaha'),
  businessAddress: z.string().max(500).optional(),
  productCount: z.coerce.number().int().min(1).max(9999).default(1),
  productNames: z.string().max(1000).optional(),
  hasNIB: z.boolean().default(false),
  hasIngredientDocs: z.boolean().default(false),
  // Package
  packageId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi gagal', issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const d = parsed.data

    // Normalize WA
    const normalizedWA = normalizeWhatsApp(d.whatsapp)
    if (!normalizedWA) {
      return NextResponse.json({ error: 'Nomor WhatsApp tidak valid' }, { status: 400 })
    }

    // Validate business type/category
    if (!BUSINESS_TYPES.includes(d.businessType)) {
      return NextResponse.json({ error: 'Jenis usaha tidak valid' }, { status: 400 })
    }
    if (!BUSINESS_CATEGORIES.includes(d.businessCategory)) {
      return NextResponse.json({ error: 'Kategori usaha tidak valid' }, { status: 400 })
    }

    // Validate package if provided
    if (d.packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: d.packageId } })
      if (!pkg || !pkg.isActive) {
        return NextResponse.json({ error: 'Paket tidak valid' }, { status: 400 })
      }
    }

    const code = await generateApplicationCode()

    const application = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          name: sanitizeString(d.customerName, 100),
          whatsapp: normalizedWA,
          email: d.email ? sanitizeString(d.email, 254) : null,
          city: d.city ? sanitizeString(d.city, 100) : null,
        },
      })

      const business = await tx.business.create({
        data: {
          customerId: customer.id,
          name: sanitizeString(d.businessName, 200),
          type: d.businessType,
          category: d.businessCategory,
          address: d.businessAddress ? sanitizeString(d.businessAddress, 500) : null,
          productCount: d.productCount,
          productNames: d.productNames ? sanitizeString(d.productNames, 1000) : null,
          hasNIB: d.hasNIB,
          hasIngredientDocs: d.hasIngredientDocs,
        },
      })

      const app = await tx.application.create({
        data: {
          code,
          customerId: customer.id,
          businessId: business.id,
          packageId: d.packageId || null,
          status: 'PENGAJUAN_DITERIMA',
        },
      })

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: app.id,
          status: 'PENGAJUAN_DITERIMA',
          note: 'Pengajuan berhasil diterima oleh sistem.',
        },
      })

      return { app, customer }
    })

    return NextResponse.json(
      {
        success: true,
        code: application.app.code,
        message: 'Pengajuan berhasil dikirim. Simpan kode pengajuan Anda.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
