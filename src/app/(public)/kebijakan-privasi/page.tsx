import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - HalalPro',
  description: 'Kebijakan privasi layanan pendampingan sertifikasi halal HalalPro.',
}

export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Kebijakan Privasi</h1>
      <p className="text-sm text-gray-500 mb-10">Terakhir diperbarui: Januari 2026</p>

      <div className="prose prose-green max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Informasi yang Kami Kumpulkan</h2>
          <p className="text-gray-600 leading-relaxed">
            Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan layanan kami, meliputi:
          </p>
          <ul className="mt-3 space-y-1.5 text-gray-600 text-sm list-disc list-inside">
            <li>Nama lengkap dan identitas pemilik usaha</li>
            <li>Nomor WhatsApp dan alamat email (jika diberikan)</li>
            <li>Data usaha: nama, jenis, kategori, dan alamat</li>
            <li>Informasi produk yang akan disertifikasi</li>
            <li>Dokumen pendukung yang diunggah (KTP, NIB, daftar bahan baku, dll.)</li>
            <li>Data penggunaan website secara anonim</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Cara Kami Menggunakan Informasi</h2>
          <p className="text-gray-600 leading-relaxed">Informasi yang kami kumpulkan digunakan untuk:</p>
          <ul className="mt-3 space-y-1.5 text-gray-600 text-sm list-disc list-inside">
            <li>Memproses pengajuan pendampingan sertifikasi halal</li>
            <li>Menghubungi Anda terkait perkembangan pengajuan</li>
            <li>Memberikan layanan konsultasi dan dukungan</li>
            <li>Meningkatkan kualitas layanan kami</li>
            <li>Mematuhi kewajiban hukum yang berlaku</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Keamanan Data</h2>
          <p className="text-gray-600 leading-relaxed">
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data Anda dari 
            akses tidak sah, perubahan, pengungkapan, atau penghancuran. Data Anda hanya dapat diakses oleh staf 
            yang berwenang dan memiliki kebutuhan untuk mengaksesnya dalam rangka memberikan layanan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Berbagi Informasi</h2>
          <p className="text-gray-600 leading-relaxed">
            Kami tidak menjual, memperdagangkan, atau memindahkan informasi pribadi Anda kepada pihak ketiga tanpa 
            persetujuan Anda, kecuali dalam hal:
          </p>
          <ul className="mt-3 space-y-1.5 text-gray-600 text-sm list-disc list-inside">
            <li>Diperlukan untuk proses pengajuan sertifikasi ke lembaga berwenang atas persetujuan Anda</li>
            <li>Diwajibkan oleh peraturan perundang-undangan yang berlaku</li>
            <li>Melindungi hak, properti, atau keselamatan kami atau orang lain</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Hak Anda</h2>
          <p className="text-gray-600 leading-relaxed">Anda memiliki hak untuk:</p>
          <ul className="mt-3 space-y-1.5 text-gray-600 text-sm list-disc list-inside">
            <li>Mengakses data pribadi yang kami miliki tentang Anda</li>
            <li>Meminta koreksi atas data yang tidak akurat</li>
            <li>Meminta penghapusan data dalam kondisi tertentu</li>
            <li>Menarik persetujuan pemrosesan data kapan saja</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Penyimpanan Data</h2>
          <p className="text-gray-600 leading-relaxed">
            Data Anda disimpan selama diperlukan untuk memenuhi tujuan yang disebutkan dalam kebijakan ini atau 
            selama diwajibkan oleh hukum. Dokumen yang diunggah disimpan di server yang aman dan tidak dapat 
            diakses secara publik.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Hubungi Kami</h2>
          <p className="text-gray-600 leading-relaxed">
            Jika Anda memiliki pertanyaan atau kekhawatiran mengenai kebijakan privasi ini, silakan hubungi kami 
            melalui WhatsApp di nomor{' '}
            <a href="https://wa.me/6283172519500" className="text-green-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
              0831-7251-9500
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
