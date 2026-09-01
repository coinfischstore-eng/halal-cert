import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@halalcert.id' },
    update: {},
    create: {
      email: 'admin@halalcert.id',
      name: 'Administrator',
      passwordHash,
      role: 'SUPERADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create packages
  const packages = [
    {
      name: 'Paket Basic',
      slug: 'basic',
      description: 'Cocok untuk usaha perorangan dengan produk tunggal yang baru memulai proses sertifikasi halal.',
      price: 0,
      priceLabel: 'Hubungi Kami',
      features: JSON.stringify([
        'Konsultasi awal (1 sesi)',
        'Panduan dokumen yang diperlukan',
        'Checklist kelengkapan berkas',
        'Pendampingan via WhatsApp',
        'Informasi alur pengajuan resmi',
      ]),
      isActive: true,
      isFeatured: false,
      sortOrder: 1,
    },
    {
      name: 'Paket UMKM',
      slug: 'umkm',
      description: 'Ideal untuk UMKM dengan 1–5 produk. Pendampingan lengkap dari persiapan hingga pengajuan.',
      price: 0,
      priceLabel: 'Hubungi Kami',
      features: JSON.stringify([
        'Konsultasi mendalam (3 sesi)',
        'Pendampingan persiapan dokumen lengkap',
        'Review & verifikasi berkas',
        'Pendampingan pengajuan',
        'Update status berkala',
        'Support WhatsApp prioritas',
        'Cocok untuk 1–5 produk',
      ]),
      isActive: true,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      name: 'Paket Profesional',
      slug: 'profesional',
      description: 'Untuk pelaku usaha dengan produk lebih dari 5, atau yang membutuhkan pendampingan menyeluruh.',
      price: 0,
      priceLabel: 'Hubungi Kami',
      features: JSON.stringify([
        'Konsultasi tidak terbatas',
        'Pendampingan dokumen prioritas',
        'Review berkas menyeluruh',
        'Pendampingan pengajuan penuh',
        'Monitoring aktif status',
        'Dedicated admin support',
        'Lebih dari 5 produk',
        'Layanan perpanjangan sertifikat',
      ]),
      isActive: true,
      isFeatured: false,
      sortOrder: 3,
    },
  ]

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: pkg,
    })
  }
  console.log('✅ Packages seeded')

  // Create FAQs
  const faqs = [
    {
      question: 'Apa itu sertifikasi halal?',
      answer: 'Sertifikasi halal adalah proses pengujian dan penilaian produk atau layanan untuk memastikan bahwa produk tersebut telah memenuhi persyaratan halal sesuai dengan syariat Islam. Sertifikat halal diterbitkan oleh Badan Penyelenggara Jaminan Produk Halal (BPJPH) melalui mekanisme resmi yang berlaku.',
      category: 'Umum',
      sortOrder: 1,
    },
    {
      question: 'Siapa yang membutuhkan sertifikasi halal?',
      answer: 'Sertifikasi halal wajib untuk pelaku usaha yang memproduksi, mendistribusikan, atau menjual produk makanan, minuman, kosmetik, obat-obatan, dan produk lain yang masuk dalam kategori yang ditetapkan pemerintah. UMKM juga sangat dianjurkan untuk memiliki sertifikat halal agar dapat memperluas pasar dan meningkatkan kepercayaan konsumen.',
      category: 'Umum',
      sortOrder: 2,
    },
    {
      question: 'Dokumen apa saja yang diperlukan?',
      answer: 'Dokumen yang umumnya diperlukan meliputi: NIB (Nomor Induk Berusaha), KTP pemilik usaha, daftar bahan baku beserta dokumen pendukung kehalalannya, diagram alur proses produksi, foto produk dan tempat produksi, serta dokumen pendukung lainnya. Kebutuhan dokumen dapat bervariasi tergantung jenis produk. Tim kami akan membantu Anda mempersiapkan seluruh dokumen yang diperlukan.',
      category: 'Dokumen',
      sortOrder: 3,
    },
    {
      question: 'Berapa lama prosesnya?',
      answer: 'Durasi proses sertifikasi halal bervariasi tergantung kelengkapan dokumen, jenis produk, dan antrian di lembaga berwenang. Umumnya proses dapat berlangsung beberapa minggu hingga beberapa bulan. Dengan pendampingan kami, Anda dapat mempersiapkan dokumen dengan lebih baik sehingga proses dapat berjalan lebih lancar.',
      category: 'Proses',
      sortOrder: 4,
    },
    {
      question: 'Berapa biaya pendampingannya?',
      answer: 'Biaya pendampingan kami bervariasi tergantung paket yang dipilih dan kebutuhan spesifik usaha Anda. Silakan hubungi kami melalui WhatsApp untuk mendapatkan informasi harga yang sesuai dengan kebutuhan Anda. Kami berkomitmen untuk transparan dalam hal biaya.',
      category: 'Biaya',
      sortOrder: 5,
    },
    {
      question: 'Apakah usaha kecil bisa mengajukan sertifikasi halal?',
      answer: 'Ya, usaha kecil dan UMKM sangat bisa dan sangat dianjurkan untuk mengajukan sertifikasi halal. Pemerintah juga menyediakan fasilitas sertifikasi halal gratis untuk UMKM tertentu melalui program yang berlaku. Tim kami berpengalaman membantu UMKM dalam proses ini.',
      category: 'Umum',
      sortOrder: 6,
    },
    {
      question: 'Bagaimana cara memulai?',
      answer: 'Mudah! Cukup hubungi kami melalui tombol WhatsApp di website ini atau isi formulir pengajuan pendampingan. Tim kami akan menghubungi Anda untuk melakukan konsultasi awal dan menjelaskan langkah-langkah selanjutnya.',
      category: 'Proses',
      sortOrder: 7,
    },
    {
      question: 'Apakah layanan ini menerbitkan sertifikat halal?',
      answer: 'Tidak. Layanan kami adalah jasa pendampingan — kami membantu Anda mempersiapkan dan mengurus dokumen, serta mendampingi proses pengajuan. Sertifikat halal resmi diterbitkan oleh Badan Penyelenggara Jaminan Produk Halal (BPJPH) dan Lembaga Pemeriksa Halal (LPH) yang berwenang sesuai ketentuan yang berlaku.',
      category: 'Umum',
      sortOrder: 8,
    },
    {
      question: 'Bagaimana cara mengecek status pengajuan?',
      answer: 'Setelah Anda mengajukan pendampingan melalui website kami, Anda akan mendapatkan kode pengajuan unik. Gunakan kode tersebut di halaman "Tracking Pengajuan" bersama nomor WhatsApp yang Anda daftarkan untuk melihat status dan perkembangan terkini pengajuan Anda.',
      category: 'Proses',
      sortOrder: 9,
    },
  ]

  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i]
    await prisma.fAQ.create({ data: faq }).catch(() => {})
  }
  console.log('✅ FAQs seeded')

  // Initialize sequence
  await prisma.applicationSequence.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', year: new Date().getFullYear(), lastSeq: 0 },
  })
  console.log('✅ Application sequence initialized')

  console.log('\n🎉 Database seeded successfully!')
  console.log('📧 Admin email: admin@halalcert.id')
  console.log('🔑 Admin password: admin123')
  console.log('⚠️  PLEASE CHANGE THE PASSWORD AFTER FIRST LOGIN!\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
