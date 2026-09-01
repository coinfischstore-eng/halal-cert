import type { Metadata } from 'next'
import { ShieldCheck, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disclaimer - HalalPro',
  description: 'Disclaimer layanan pendampingan sertifikasi halal HalalPro.',
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-full text-sm font-medium mb-4">
          <AlertTriangle className="w-4 h-4" />
          Penting untuk Dibaca
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Disclaimer</h1>
        <p className="text-sm text-gray-500">Terakhir diperbarui: Januari 2026</p>
      </div>

      {/* Main disclaimer box */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-amber-900 text-base mb-2">Pernyataan Penting</h2>
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>HalalPro adalah layanan jasa pendampingan swasta.</strong> Kami BUKAN BPJPH, BUKAN MUI, 
              BUKAN lembaga pemerintah, dan TIDAK menerbitkan sertifikat halal. 
              Sertifikat halal resmi hanya diterbitkan oleh Badan Penyelenggara Jaminan Produk Halal (BPJPH) 
              melalui mekanisme resmi yang berlaku sesuai Undang-Undang Jaminan Produk Halal.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Tentang HalalPro</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            HalalPro adalah perusahaan konsultan swasta yang menyediakan layanan pendampingan dan konsultasi 
            dalam proses pengurusan sertifikasi halal. Kami membantu pelaku usaha mempersiapkan dokumen, 
            memahami persyaratan, dan mengajukan permohonan sertifikasi halal ke lembaga berwenang.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Proses Sertifikasi Resmi</h2>
          <p className="text-gray-600 leading-relaxed text-sm mb-3">
            Proses sertifikasi halal resmi di Indonesia diatur oleh:
          </p>
          <ul className="space-y-2 text-gray-600 text-sm list-disc list-inside">
            <li>Undang-Undang Nomor 33 Tahun 2014 tentang Jaminan Produk Halal</li>
            <li>Peraturan Pemerintah Nomor 39 Tahun 2021 tentang Penyelenggaraan Bidang Jaminan Produk Halal</li>
            <li>Peraturan BPJPH yang berlaku</li>
          </ul>
          <p className="text-gray-600 leading-relaxed text-sm mt-3">
            Sertifikasi halal resmi melibatkan BPJPH sebagai penyelenggara dan Lembaga Pemeriksa Halal (LPH) 
            yang telah diakreditasi untuk melakukan pemeriksaan dan/atau pengujian produk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Apa yang Kami Lakukan</h2>
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <div className="flex items-start gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm font-medium">Layanan Pendampingan Kami Meliputi:</p>
            </div>
            <ul className="space-y-1.5 text-green-700 text-sm list-disc list-inside ml-2">
              <li>Konsultasi dan analisis kebutuhan sertifikasi</li>
              <li>Pembuatan checklist dan panduan persiapan dokumen</li>
              <li>Review dan verifikasi kelengkapan dokumen</li>
              <li>Pendampingan dalam proses pengajuan</li>
              <li>Komunikasi dan koordinasi dengan lembaga terkait</li>
              <li>Monitoring perkembangan status pengajuan</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Tidak Ada Jaminan Keberhasilan</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Meskipun kami berkomitmen untuk memberikan layanan terbaik, HalalPro tidak dapat menjamin 
            keberhasilan pengajuan sertifikasi halal. Keputusan akhir sepenuhnya ada di tangan BPJPH dan 
            lembaga pemeriksa halal yang berwenang. Hasil pengajuan bergantung pada kelengkapan dan 
            kebenaran dokumen serta persyaratan yang ditetapkan oleh lembaga berwenang.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Waspada Penipuan</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Berhati-hatilah terhadap pihak yang mengatasnamakan HalalPro atau menawarkan sertifikat halal 
            secara ilegal. Sertifikat halal yang sah hanya diterbitkan melalui proses resmi BPJPH. 
            Jika Anda meragukan keaslian komunikasi dari pihak yang mengaku HalalPro, 
            silakan verifikasi langsung melalui nomor WhatsApp resmi kami:{' '}
            <a href="https://wa.me/6283172519500" className="text-green-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
              0831-7251-9500
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
