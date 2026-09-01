import type { Metadata } from 'next'
import { TrackingPage } from '@/components/TrackingPage'
import { Search, Clock, ShieldCheck, Phone } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Cek Status Pengajuan - HalalPro',
  description: 'Pantau status dan perkembangan pengajuan pendampingan sertifikasi halal Anda.',
}

export default function TrackingRoute() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-sm font-medium mb-4">
                <Search className="w-4 h-4" />
                Status Pengajuan
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pantau Perkembangan Pengajuan
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Masukkan kode pengajuan dan nomor WhatsApp untuk melihat status terkini pengajuan Anda.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <p className="font-semibold text-gray-900 text-sm">Cara Menggunakan:</p>
              {[
                { icon: Search, text: 'Masukkan kode pengajuan (format: HALAL-XXXX-XXXXX)' },
                { icon: Phone, text: 'Masukkan nomor WhatsApp yang Anda daftarkan' },
                { icon: Clock, text: 'Lihat status dan riwayat pengajuan Anda' },
                { icon: ShieldCheck, text: 'Upload dokumen yang diperlukan' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">{text}</span>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs text-amber-800 leading-relaxed">
                💡 Tidak menemukan pengajuan Anda? Pastikan kode dan nomor WhatsApp sesuai dengan yang Anda daftarkan.{' '}
                <a
                  href={getWhatsAppUrl('Halo, saya kesulitan mengecek status pengajuan saya. Mohon bantuannya.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-700 hover:underline"
                >
                  Hubungi tim kami.
                </a>
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <TrackingPage />
          </div>
        </div>
      </div>
    </div>
  )
}
