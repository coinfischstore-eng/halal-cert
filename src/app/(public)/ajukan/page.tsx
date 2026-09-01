export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { ApplicationForm } from '@/components/ApplicationForm'
import { ShieldCheck, Clock, CheckCircle2, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ajukan Pendampingan - HalalPro',
  description: 'Isi formulir pengajuan pendampingan sertifikasi halal. Tim kami siap membantu Anda.',
}

async function getActivePackages() {
  return prisma.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      description: true,
      priceLabel: true,
      price: true,
      isFeatured: true,
    },
  })
}

export default async function AjukanPage() {
  const packages = await getActivePackages()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-sm font-medium mb-4">
                <ShieldCheck className="w-4 h-4" />
                Formulir Pengajuan
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ajukan Pendampingan Sertifikasi Halal
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Isi formulir berikut dan tim kami akan menghubungi Anda dalam waktu 1×24 jam kerja 
                untuk konsultasi awal.
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <p className="font-semibold text-gray-900 text-sm">Apa yang Anda Dapatkan:</p>
              {[
                { icon: CheckCircle2, text: 'Konsultasi awal gratis via WhatsApp' },
                { icon: FileText, text: 'Panduan dokumen yang diperlukan' },
                { icon: Clock, text: 'Update status berkala' },
                { icon: ShieldCheck, text: 'Pendampingan hingga pengajuan selesai' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Privacy note */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-blue-700 leading-relaxed">
                🔒 <strong>Data Anda aman.</strong> Informasi yang Anda berikan hanya digunakan untuk 
                keperluan pendampingan sertifikasi halal dan tidak dibagikan ke pihak ketiga.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">Memuat formulir...</div>}>
              <ApplicationForm packages={packages} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
