import { prisma } from '@/lib/prisma'
import { CertificatesManager } from '@/components/admin/CertificatesManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sertifikat - Admin HalalPro' }
export const dynamic = 'force-dynamic'

export default async function CertificatesPage() {
  const certificates = await prisma.certificate.findMany({ orderBy: { sortOrder: 'asc' } })
  return (
    <div className="space-y-5 lg:pt-0 pt-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Sertifikat</h1>
        <p className="text-sm text-gray-500 mt-1">Upload dan kelola portofolio sertifikat halal</p>
      </div>
      <CertificatesManager initialCertificates={certificates} />
    </div>
  )
}
