import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { normalizeWhatsApp } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, whatsapp } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Kode pengajuan diperlukan' }, { status: 400 })
    }

    if (!whatsapp || typeof whatsapp !== 'string') {
      return NextResponse.json({ error: 'Nomor WhatsApp diperlukan' }, { status: 400 })
    }

    const normalizedWA = normalizeWhatsApp(whatsapp)
    if (!normalizedWA) {
      return NextResponse.json({ error: 'Nomor WhatsApp tidak valid' }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: { code: code.trim().toUpperCase() },
      select: {
        id: true,
        code: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
        adminNote: true,
        customer: {
          select: {
            name: true,
            whatsapp: true,
          },
        },
        business: {
          select: {
            name: true,
            type: true,
            category: true,
            productCount: true,
          },
        },
        package: {
          select: {
            name: true,
          },
        },
        statusHistory: {
          select: {
            status: true,
            changedAt: true,
            note: true,
          },
          orderBy: { changedAt: 'asc' },
        },
        notes: {
          where: { isPublic: true },
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Kode pengajuan tidak ditemukan' }, { status: 404 })
    }

    // Verify WA matches
    if (application.customer.whatsapp !== normalizedWA) {
      return NextResponse.json({ error: 'Data tidak cocok. Periksa kembali kode dan nomor WhatsApp.' }, { status: 403 })
    }

    return NextResponse.json({ application })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
