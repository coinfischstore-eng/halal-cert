import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { normalizeWhatsApp, isAllowedFileType, MAX_FILE_SIZE_BYTES } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

const UPLOAD_BASE = 'uploads'

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
      return NextResponse.json({ error: 'Tipe file tidak diizinkan. Gunakan JPG, PNG, WebP, atau PDF.' }, { status: 400 })
    }

    // Save file
    const ext = file.name.split('.').pop() || 'bin'
    const storedName = `${uuidv4()}.${ext}`
    const uploadPath = path.join(process.cwd(), UPLOAD_BASE, application.id)

    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    await writeFile(path.join(uploadPath, storedName), Buffer.from(bytes))

    // Save to DB
    const doc = await prisma.document.create({
      data: {
        applicationId: application.id,
        type: documentType,
        fileName: file.name,
        storedName,
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
