import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan - HalalPro',
  description: 'Syarat dan ketentuan penggunaan layanan pendampingan sertifikasi halal HalalPro.',
}

export default function SyaratKetentuanPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Syarat &amp; Ketentuan</h1>
      <p className="text-sm text-gray-500 mb-10">Terakhir diperbarui: Januari 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Penerimaan Syarat</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Dengan menggunakan layanan HalalPro, Anda menyetujui syarat dan ketentuan yang berlaku. 
            Jika Anda tidak setuju, mohon untuk tidak menggunakan layanan kami.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Deskripsi Layanan</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            HalalPro menyediakan jasa pendampingan dalam proses pengurusan sertifikasi halal. Layanan kami meliputi 
            konsultasi, persiapan dokumen, dan pendampingan pengajuan ke lembaga berwenang. Kami bukan lembaga 
            pemerintah, bukan BPJPH, bukan MUI, dan tidak menerbitkan sertifikat halal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Kewajiban Pengguna</h2>
          <p className="text-gray-600 leading-relaxed text-sm mb-3">Sebagai pengguna layanan, Anda berkewajiban untuk:</p>
          <ul className="space-y-1.5 text-gray-600 text-sm list-disc list-inside">
            <li>Memberikan informasi yang benar, akurat, dan lengkap</li>
            <li>Mengunggah dokumen yang asli dan valid</li>
            <li>Tidak menggunakan layanan untuk tujuan yang melanggar hukum</li>
            <li>Menjaga kerahasiaan kode pengajuan Anda</li>
            <li>Merespons permintaan informasi tambahan dengan tepat waktu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Batasan Tanggung Jawab</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            HalalPro berperan sebagai pendamping dalam proses sertifikasi halal. Kami tidak bertanggung jawab atas:
          </p>
          <ul className="mt-3 space-y-1.5 text-gray-600 text-sm list-disc list-inside">
            <li>Keputusan akhir dari BPJPH atau lembaga pemeriksa halal</li>
            <li>Penolakan pengajuan akibat ketidaklengkapan dokumen yang disebabkan informasi tidak akurat dari pengguna</li>
            <li>Keterlambatan proses dari pihak lembaga berwenang</li>
            <li>Perubahan regulasi atau persyaratan dari pihak berwenang</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Pembayaran</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Detail biaya pendampingan akan dikomunikasikan secara transparan sebelum dimulainya layanan. 
            Pembayaran hanya dilakukan ke rekening resmi yang dikomunikasikan oleh tim HalalPro. 
            Jika Anda ragu, konfirmasi melalui nomor WhatsApp resmi kami.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Kerahasiaan</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Kami berkomitmen menjaga kerahasiaan seluruh informasi dan dokumen yang Anda berikan. 
            Data Anda tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum 
            atau diperlukan untuk proses pengajuan sertifikasi sesuai kesepakatan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Perubahan Syarat</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui 
            website ini. Penggunaan layanan yang berkelanjutan setelah perubahan dianggap sebagai persetujuan 
            atas syarat yang baru.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Hukum yang Berlaku</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Syarat dan ketentuan ini diatur oleh hukum Negara Kesatuan Republik Indonesia. 
            Setiap perselisihan akan diselesaikan secara musyawarah mufakat.
          </p>
        </section>
      </div>
    </div>
  )
}
