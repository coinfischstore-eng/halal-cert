import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'
import { APPLICATION_STATUS_ORDER } from '@/lib/types'
import { sanitizeString } from '@/lib/utils'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      customer: true,
      business: true,
      package: true,
      statusHistory: { orderBy: { changedAt: 'asc' } },
      documents: { orderBy: { uploadedAt: 'desc' } },
      notes: {
        include: { admin: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ application })
}

const updateSchema = z.object({
  status: z.string().optional(),
  adminNote: z.string().max(2000).optional(),
  internalNote: z.string().max(2000).optional(),
  noteContent: z.string().max(2000).optional(),
  noteIsPublic: z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdminAuth(req)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validasi gagal' }, { status: 400 })
  }

  const application = await prisma.application.findUnique({ where: { id } })
  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { status, adminNote, internalNote, noteContent, noteIsPublic } = parsed.data

  // Validate status
  if (status && !APPLICATION_STATUS_ORDER.includes(status as typeof APPLICATION_STATUS_ORDER[number])) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
  }

  await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = {}

    if (status) updateData.status = status
    if (adminNote !== undefined) updateData.adminNote = sanitizeString(adminNote, 2000)
    if (internalNote !== undefined) updateData.internalNote = sanitizeString(internalNote, 2000)
    if (status === 'SELESAI') updateData.completedAt = new Date()

    if (Object.keys(updateData).length > 0) {
      await tx.application.update({ where: { id }, data: updateData })
    }

    if (status && status !== application.status) {
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: id,
          status,
          changedBy: auth.name,
          note: `Status diubah ke ${status}`,
        },
      })
    }

    if (noteContent) {
      await tx.applicationNote.create({
        data: {
          applicationId: id,
          adminId: auth.adminId,
          content: sanitizeString(noteContent, 2000),
          isPublic: noteIsPublic ?? false,
        },
      })
    }
  })

  const updated = await prisma.application.findUnique({
    where: { id },
    include: {
      customer: true,
      business: true,
      package: true,
      statusHistory: { orderBy: { changedAt: 'asc' } },
      documents: { orderBy: { uploadedAt: 'desc' } },
      notes: {
        include: { admin: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return NextResponse.json({ application: updated })
}
