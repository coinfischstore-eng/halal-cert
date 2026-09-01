import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ApplicationDetail } from '@/components/admin/ApplicationDetail'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const app = await prisma.application.findUnique({ where: { id }, select: { code: true } })
  return { title: `${app?.code || 'Pengajuan'} - Admin HalalPro` }
}

export default async function ApplicationDetailPage({ params }: Props) {
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

  if (!application) notFound()

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { sortOrder: 'asc' },
  })

  return <ApplicationDetail application={application} packages={packages} />
}
