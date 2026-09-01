import { prisma } from '@/lib/prisma'
import { PackagesManager } from '@/components/admin/PackagesManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Paket - Admin HalalPro' }
export const dynamic = 'force-dynamic'

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({ orderBy: { sortOrder: 'asc' } })
  return (
    <div className="space-y-5 lg:pt-0 pt-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Paket</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola paket dan harga layanan</p>
      </div>
      <PackagesManager initialPackages={packages} />
    </div>
  )
}
