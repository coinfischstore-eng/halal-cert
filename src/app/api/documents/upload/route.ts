import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeWhatsApp, isAllowedFileType, MAX_FILE_SIZE_BYTES } from '@/lib/utils'
import { saveDocumentFile } from '@/lib/storage'

const DOCUMENT_TYPES = ['NIB', 'KTP', 'INGREDIENT_LIST', 'PRODUCT_PHOTO', 'OTHER']

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const code = formData.get('code') as string
    const whatsapp = formData.get('whatsapp') as string
    const documentType = (formData.get('documentType') as string) || 'OTHER'
    const file = formData.get('file') as File | null

    if (!code || !whatsapp || !file) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    if (!DOCUMENT_TYPES.includes(documentType)) {
      return NextResponse.json({ error: 'Tipe dokumen tidak valid' }, { status: 400 })
    }

    const normalizedWA = normalizeWhatsApp(whatsapp)
    if (!normalizedWA) {
      return NextResponse.json({ error: 'Nomor WhatsApp tidak valid' }, { status: 400 })
    }

    // Verify application ownership
    const application = await prisma.application.findUnique({
      where: { code: code.trim().toUpperCase() },
      select: {
        id: true,
        customer: { select: { whatsapp: true } },
      },
    })

    if (!application || application.customer.whatsapp !== normalizedWA) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'Ukuran file maksimal 5 MB' }, { status: 400 })
    }

    if (!isAllowedFileType(file.type)) {
      return NextResponse.json(
        { error: 'Tipe file tidak diizinkan. Gunakan JPG, PNG, WebP, atau PDF.' },
        { status: 400 }
      )
    }

    // Save file to cloud or local storage
    const storedUrl = await saveDocumentFile(file, application.id)

    // Derive safe extension from MIME type (ignore user-provided filename extension)
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
    }
    const ext = mimeToExt[file.type] ?? 'bin'
    const storedName = storedUrl.split('/').pop() ?? `file.${ext}`

    // Save metadata to DB
    const doc = await prisma.document.create({
      data: {
        applicationId: application.id,
        type: documentType,
        fileName: file.name.replace(/[^\w.\-]/g, '_').slice(0, 255), // sanitize original name for display
        storedName,
        storedUrl: process.env.CLOUDINARY_URL ? storedUrl : null,
        fileSize: file.size,
        mimeType: file.type,
        status: 'UPLOADED',
      },
    })

    return NextResponse.json({ success: true, documentId: doc.id }, { status: 201 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
