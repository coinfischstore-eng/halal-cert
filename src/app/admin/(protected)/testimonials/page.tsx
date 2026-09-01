import { prisma } from '@/lib/prisma'
import { TestimonialsManager } from '@/components/admin/TestimonialsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Testimoni - Admin HalalPro' }
export const dynamic = 'force-dynamic'

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } })
  return (
    <div className="space-y-5 lg:pt-0 pt-14">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Testimoni</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola testimoni pelanggan</p>
      </div>
      <TestimonialsManager initialTestimonials={testimonials} />
    </div>
  )
}
