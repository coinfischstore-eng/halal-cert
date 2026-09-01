import { prisma } from '@/lib/prisma'
import { FAQsManager } from '@/components/admin/FAQsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'FAQ - Admin HalalPro' }
export const dynamic = 'force-dynamic'

export default async function FAQsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: 'asc' } })
  return (
    <div className="space-y-5 lg:pt-0 pt-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen FAQ</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola pertanyaan yang sering diajukan</p>
      </div>
      <FAQsManager initialFaqs={faqs} />
    </div>
  )
}
