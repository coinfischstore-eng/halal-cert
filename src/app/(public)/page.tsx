export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2, ShieldCheck, Clock, Users, FileText,
  ArrowRight, Star, ChevronDown, Award,
  Phone, Sparkles, Zap, BadgeCheck,
  BookOpen, Search, ClipboardCheck, Send, Eye,
  X as XIcon,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getWhatsAppUrl, DEFAULT_WA_MESSAGE } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

// ──────────────────────────────────────────────────────────────
// Data fetching
// ──────────────────────────────────────────────────────────────

async function getPackages() {
  return prisma.package.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
}
async function getFAQs() {
  return prisma.fAQ.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 9 })
}
async function getTestimonials() {
  return prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 6 })
}
async function getCertificates() {
  return prisma.certificate.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' }, take: 6 })
}

// ──────────────────────────────────────────────────────────────
// Hero Section
// ──────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-green-950 to-slate-900 pt-16">
      {/* Animated blobs */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl anim-blob" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl anim-blob delay-300" style={{animationDelay:'2s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl anim-blob" style={{animationDelay:'4s'}} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',backgroundSize:'40px 40px'}} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="anim-fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-7 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Jasa Pendampingan Sertifikasi Halal Profesional
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
              Urus Sertifikasi Halal{' '}
              <span className="text-gradient-green">Lebih Mudah,</span>{' '}
              <span className="text-amber-400">Aman</span>{' '}
              &amp;{' '}
              <span className="text-sky-400">Terarah</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-9 max-w-xl">
              Pendampingan sertifikasi halal untuk UMKM dan pelaku usaha — dari pengecekan dokumen hingga proses sertifikasi selesai, kami dampingi setiap langkahnya.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/ajukan"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl hover:from-green-400 hover:to-emerald-400 shadow-xl shadow-green-900/50 hover:shadow-green-800/60 transition-all active:scale-[0.97] text-base"
              >
                Ajukan Sertifikasi
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <a
                href={getWhatsAppUrl(DEFAULT_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white/10 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all text-base"
              >
                <Phone className="w-4.5 h-4.5 text-green-400" />
                Konsultasi via WhatsApp
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: ShieldCheck, text: 'Pendampingan Profesional', color: 'text-green-400' },
                { icon: Eye, text: 'Proses Transparan', color: 'text-blue-400' },
                { icon: FileText, text: 'Dokumen Aman', color: 'text-purple-400' },
                { icon: Phone, text: 'Dukungan WhatsApp', color: 'text-amber-400' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className="text-xs text-slate-300 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative flex justify-center lg:justify-end anim-slide-left delay-300">
            {/* Main card */}
            <div className="relative z-10 w-full max-w-sm">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-2xl">
                {/* Shield icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-green-900/50 anim-float">
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <BadgeCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">Sertifikasi Halal</p>
                    <p className="text-green-300 text-sm">Pendampingan Lengkap</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { step: '01', label: 'Konsultasi Awal', done: true },
                    { step: '02', label: 'Persiapan Dokumen', done: true },
                    { step: '03', label: 'Pengajuan', active: true },
                    { step: '04', label: 'Proses Sertifikasi', done: false },
                    { step: '05', label: 'Sertifikat Terbit', done: false },
                  ].map((s) => (
                    <div key={s.step} className={`flex items-center gap-3 rounded-xl p-2.5 ${s.active ? 'bg-green-500/20 border border-green-500/30' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        s.done ? 'bg-green-500 text-white' : s.active ? 'bg-amber-400 text-slate-900' : 'bg-white/10 text-slate-400'
                      }`}>
                        {s.done ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                      </div>
                      <span className={`text-sm font-medium ${s.active ? 'text-white' : s.done ? 'text-slate-300' : 'text-slate-500'}`}>
                        {s.label}
                      </span>
                      {s.active && <span className="ml-auto text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">Proses</span>}
                    </div>
                  ))}
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                  <p className="text-green-300 text-xs font-medium">Dipandu oleh tim ahli kami</p>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-2xl px-4 py-3 anim-float-reverse">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">UMKM Bersertifikat</p>
                    <p className="text-[10px] text-slate-500">Proses selesai</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-2xl px-4 py-3 anim-float delay-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Dokumen Aman</p>
                    <p className="text-[10px] text-slate-500">Enkripsi terproteksi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 anim-fade-in delay-800">
        <span className="text-xs text-slate-400 font-medium">Scroll untuk melihat lebih</span>
        <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Trust Banner
// ──────────────────────────────────────────────────────────────

function TrustBanner() {
  const stats = [
    { value: '100+', label: 'Pelaku Usaha Dilayani', icon: Users, color: 'from-green-500 to-emerald-600' },
    { value: '98%', label: 'Kepuasan Pelanggan', icon: Star, color: 'from-amber-500 to-yellow-500' },
    { value: '3+', label: 'Tahun Pengalaman', icon: Award, color: 'from-blue-500 to-indigo-600' },
    { value: '24/7', label: 'Dukungan WhatsApp', icon: Phone, color: 'from-purple-500 to-violet-600' },
  ]

  return (
    <section className="bg-white border-b border-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <div key={label} className={`anim-fade-up delay-${(i + 1) * 100} group`}>
              <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5.5 h-5.5 text-white" />
                </div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Problem → Solution Section
// ──────────────────────────────────────────────────────────────

function ProblemSolutionSection() {
  const problems = [
    'Bingung dokumen apa saja yang diperlukan',
    'Tidak tahu alur pengajuan yang benar',
    'Takut salah langkah atau ditolak',
    'Tidak punya waktu mengurus sendiri',
  ]
  const solutions = [
    { icon: BookOpen, text: 'Konsultasi lengkap mengenai dokumen & syarat', color: 'bg-green-100 text-green-600' },
    { icon: ClipboardCheck, text: 'Panduan alur pengajuan yang jelas & terstruktur', color: 'bg-blue-100 text-blue-600' },
    { icon: ShieldCheck, text: 'Pendampingan penuh agar proses berjalan lancar', color: 'bg-purple-100 text-purple-600' },
    { icon: Clock, text: 'Kami yang urus, Anda fokus bisnis', color: 'bg-amber-100 text-amber-600' },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 anim-fade-up">
          <span className="inline-block bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Kenali Masalah Anda
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            Masih Bingung Mengurus Sertifikasi Halal?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">Banyak pelaku usaha menghadapi kendala yang sama — tapi kini ada solusinya.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Problems */}
          <div className="space-y-3 anim-slide-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tantangan Umum</p>
            {problems.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 hover:border-red-200 transition-colors">
                <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <XIcon className="w-3.5 h-3.5 text-red-500" />
                </div>
                <p className="text-sm text-slate-700 font-medium">{p}</p>
              </div>
            ))}
          </div>

          {/* Solutions */}
          <div className="anim-slide-left">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-green-200">
                <Sparkles className="w-4 h-4" />
                Tenang, Kami Bantu
              </div>
            </div>
            <div className="space-y-3">
              {solutions.map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all card-hover">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-sm text-slate-700 font-medium">{text}</p>
                  <CheckCircle2 className="w-4.5 h-4.5 text-green-500 flex-shrink-0 ml-auto mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Services Section
// ──────────────────────────────────────────────────────────────

function ServicesSection() {
  const services = [
    { icon: BookOpen, title: 'Konsultasi Sertifikasi Halal', desc: 'Konsultasi mendalam mengenai jenis sertifikasi yang dibutuhkan dan persyaratan spesifik produk Anda.', color: 'from-green-400 to-emerald-500', bg: 'bg-green-50', border: 'border-green-100' },
    { icon: ClipboardCheck, title: 'Pemeriksaan Dokumen', desc: 'Review menyeluruh dokumen Anda sebelum pengajuan untuk memastikan kelengkapan dan keabsahannya.', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50', border: 'border-blue-100' },
    { icon: Send, title: 'Pendampingan Pengajuan', desc: 'Mendampingi proses pengajuan resmi ke lembaga berwenang dengan tepat dan sesuai ketentuan.', color: 'from-purple-400 to-violet-500', bg: 'bg-purple-50', border: 'border-purple-100' },
    { icon: ShieldCheck, title: 'Pendampingan Proses', desc: 'Mendampingi seluruh tahapan proses sertifikasi dari awal pengajuan hingga sertifikat terbit.', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { icon: Search, title: 'Monitoring Status', desc: 'Pemantauan aktif status pengajuan dan laporan berkala agar Anda selalu tahu perkembangannya.', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { icon: FileText, title: 'Bantuan Administrasi', desc: 'Bantuan penyiapan formulir, surat-menyurat, dan segala keperluan administrasi terkait proses sertifikasi.', color: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  ]

  return (
    <section id="layanan" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 anim-fade-up">
          <span className="inline-block bg-green-50 text-green-600 border border-green-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Layanan Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Pendampingan{' '}
            <span className="text-gradient-green">Lengkap</span>{' '}
            dari A hingga Z
          </h2>
          <p className="text-slate-500 leading-relaxed">Kami menyediakan layanan komprehensif untuk memastikan proses sertifikasi halal Anda berjalan lancar dan tepat.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
            <div key={title} className={`anim-fade-up delay-${(i % 3 + 1) * 100} group p-6 bg-white rounded-3xl border-2 ${border} hover:shadow-xl transition-all duration-300 card-hover`}>
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-md`}>
                  <Icon className="w-4.5 h-4.5 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Pelajari lebih <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Process Timeline Section
// ──────────────────────────────────────────────────────────────

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Konsultasi', desc: 'Konsultasi awal via WhatsApp untuk mengetahui kebutuhan dan kondisi usaha Anda.', icon: Phone, color: 'from-green-500 to-emerald-600' },
    { num: '02', title: 'Pengumpulan Dokumen', desc: 'Kami berikan checklist lengkap dan mendampingi persiapan seluruh dokumen yang diperlukan.', icon: FileText, color: 'from-blue-500 to-indigo-600' },
    { num: '03', title: 'Pemeriksaan', desc: 'Tim kami memeriksa dan memverifikasi semua dokumen sebelum proses pengajuan dimulai.', icon: ClipboardCheck, color: 'from-purple-500 to-violet-600' },
    { num: '04', title: 'Pengajuan', desc: 'Mendampingi pengajuan resmi ke lembaga berwenang sesuai prosedur yang berlaku.', icon: Send, color: 'from-amber-500 to-orange-600' },
    { num: '05', title: 'Proses Sertifikasi', desc: 'Monitoring aktif perkembangan proses sertifikasi dan komunikasi berkala kepada Anda.', icon: Search, color: 'from-rose-500 to-pink-600' },
    { num: '06', title: 'Sertifikat Terbit', desc: 'Sertifikat halal resmi terbit. Kami bantu informasikan langkah perpanjangan di masa mendatang.', icon: BadgeCheck, color: 'from-emerald-500 to-teal-600' },
  ]

  return (
    <section id="proses" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 anim-fade-up">
          <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Alur Proses
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            6 Langkah Menuju{' '}
            <span className="text-gradient-blue">Sertifikasi Halal</span>
          </h2>
          <p className="text-slate-500">Proses yang terstruktur, transparan, dan didampingi penuh oleh tim ahli kami.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map(({ num, title, desc, icon: Icon, color }, i) => (
            <div key={num} className={`anim-fade-up delay-${(i % 3 + 1) * 100} group relative`}>
              <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:border-transparent transition-all duration-300 h-full card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <div className="text-right flex-1">
                    <span className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">{num}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 anim-fade-up delay-600">
          <Link
            href="/ajukan"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:from-green-500 hover:to-emerald-500 shadow-xl shadow-green-200 hover:shadow-green-300 transition-all active:scale-[0.97] text-base"
          >
            Mulai Proses Sekarang
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Packages Section
// ──────────────────────────────────────────────────────────────

async function PackagesSection() {
  const packages = await getPackages()
  const gradients = [
    { card: 'from-slate-50 to-white', btn: 'from-green-600 to-emerald-600', accent: 'text-green-600' },
    { card: 'from-green-600 to-emerald-700', btn: 'from-white to-white', accent: 'text-white' },
    { card: 'from-slate-800 to-slate-900', btn: 'from-green-500 to-emerald-500', accent: 'text-green-400' },
  ]

  return (
    <section id="paket" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 anim-fade-up">
          <span className="inline-block bg-amber-50 text-amber-600 border border-amber-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Paket &amp; Harga
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Pilih Paket yang{' '}
            <span className="text-gradient-gold">Tepat untuk Anda</span>
          </h2>
          <p className="text-slate-500 leading-relaxed">Setiap paket dirancang untuk memenuhi kebutuhan yang berbeda — dari UMKM hingga perusahaan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg, i) => {
            const features: string[] = JSON.parse(pkg.features || '[]')
            const g = gradients[i % 3]
            const isFeatured = pkg.isFeatured

            return (
              <div key={pkg.id} className={`anim-fade-up delay-${(i + 1) * 200} relative rounded-3xl p-7 flex flex-col card-hover ${isFeatured ? `bg-gradient-to-br ${g.card}` : `bg-gradient-to-br ${g.card} border-2 border-slate-100 hover:border-green-200`} ${isFeatured ? 'shadow-2xl shadow-green-200' : 'shadow-lg hover:shadow-xl'}`}>
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 text-xs font-black px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    ⭐ PALING POPULER
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-md`}>
                    <Award className={`w-6 h-6 text-white`} />
                  </div>
                  <h3 className={`font-black text-xl mb-2 ${isFeatured ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3>
                  <p className={`text-sm leading-relaxed ${isFeatured ? 'text-green-100' : 'text-slate-500'}`}>{pkg.description}</p>
                </div>

                <div className="mb-7">
                  <p className={`text-3xl font-black ${isFeatured ? 'text-white' : g.accent}`}>
                    {pkg.priceLabel || formatCurrency(pkg.price)}
                  </p>
                  <p className={`text-xs mt-1 ${isFeatured ? 'text-green-200' : 'text-slate-400'}`}>Hubungi kami untuk detail</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${isFeatured ? 'text-green-300' : 'text-green-500'}`} />
                      <span className={`text-sm ${isFeatured ? 'text-green-50' : 'text-slate-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/ajukan?paket=${pkg.slug}`}
                  className={`block text-center px-5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.97] shadow-md ${
                    isFeatured
                      ? 'bg-white text-green-700 hover:bg-green-50 shadow-white/20'
                      : `bg-gradient-to-r ${g.btn} text-white hover:opacity-90 shadow-green-100`
                  }`}
                >
                  Pilih Paket Ini →
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10 anim-fade-up delay-600">
          <p className="text-sm text-slate-500">
            Tidak yakin? {' '}
            <a href={getWhatsAppUrl('Halo, saya ingin berkonsultasi tentang paket pendampingan sertifikasi halal yang sesuai.')}
              target="_blank" rel="noopener noreferrer"
              className="text-green-600 font-bold hover:underline">
              Konsultasi gratis sekarang →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Certificates Section
// ──────────────────────────────────────────────────────────────

async function CertificatesSection() {
  const certs = await getCertificates()

  return (
    <section id="sertifikat" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 anim-fade-up">
          <span className="inline-block bg-purple-50 text-purple-600 border border-purple-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Portofolio
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Bukti Nyata{' '}
            <span className="text-gradient-blue">Pendampingan Kami</span>
          </h2>
          <p className="text-slate-500 leading-relaxed">Beberapa usaha yang telah berhasil kami bantu dalam proses pendampingan sertifikasi halal.</p>
        </div>

        {certs.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BadgeCheck className="w-8 h-8 text-purple-400" />
            </div>
            <p className="font-bold text-slate-700 mb-1">Portfolio Segera Hadir</p>
            <p className="text-sm text-slate-400 leading-relaxed">Data sertifikat akan ditampilkan di sini setelah disetujui tim admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {certs.map((cert, i) => (
              <div key={cert.id} className={`anim-fade-up delay-${(i % 3 + 1) * 100} group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300 card-hover`}>
                {/* Image area */}
                <div className="relative h-44 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                  {cert.imageUrl ? (
                    <Image
                      src={cert.imageUrl}
                      alt={`Sertifikat ${cert.businessName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <BadgeCheck className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                      <p className="text-xs text-purple-400 font-medium">Sertifikat Halal</p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                    ✓ HALAL
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <p className="font-bold text-slate-900 text-sm mb-0.5">{cert.businessName}</p>
                  {cert.productName && <p className="text-xs text-slate-500 mb-1">{cert.productName}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">{cert.year}</span>
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" /> Tersertifikasi
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Testimonials Section
// ──────────────────────────────────────────────────────────────

async function TestimonialsSection() {
  const testimonials = await getTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section id="testimoni" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 anim-fade-up">
          <span className="inline-block bg-amber-50 text-amber-600 border border-amber-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Kata{' '}
            <span className="text-gradient-gold">Pelanggan Kami</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={t.id} className={`anim-fade-up delay-${(i % 3 + 1) * 100} group bg-white rounded-3xl border-2 border-slate-100 p-6 hover:border-amber-200 hover:shadow-xl transition-all duration-300 card-hover`}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-3">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                {t.photoUrl ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-green-100">
                    <Image src={t.photoUrl} alt={t.name} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-black text-sm">{t.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  {(t.businessName || t.location) && (
                    <p className="text-xs text-slate-400">
                      {[t.businessName, t.location].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// FAQ Section
// ──────────────────────────────────────────────────────────────

async function FAQSection() {
  const faqs = await getFAQs()

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 anim-fade-up">
          <span className="inline-block bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Pertanyaan yang{' '}
            <span className="text-gradient-blue">Sering Diajukan</span>
          </h2>
          <p className="text-slate-500">
            Tidak menemukan jawaban?{' '}
            <a href={getWhatsAppUrl('Halo, saya punya pertanyaan mengenai sertifikasi halal.')} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold hover:underline">
              Tanya langsung via WhatsApp →
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={faq.id} className={`anim-fade-up delay-${Math.min((i + 1) * 100, 500)} group bg-white rounded-2xl border-2 border-slate-100 hover:border-green-200 overflow-hidden transition-colors`} open={i === 0}>
              <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
                <span className="font-semibold text-slate-900 text-sm md:text-base pr-4">{faq.question}</span>
                <div className="w-7 h-7 bg-slate-50 group-open:bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:text-green-600 group-open:rotate-180 transition-all duration-300" />
                </div>
              </summary>
              <div className="px-5 pb-5">
                <div className="h-px bg-slate-100 mb-4" />
                <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// CTA Section
// ──────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section id="kontak" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700" />
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-white/20 anim-fade-up">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          Mulai Sekarang, Gratis Konsultasi
        </div>

        <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight anim-fade-up delay-100">
          Siap Mengurus<br />
          Sertifikasi Halal?
        </h2>

        <p className="text-green-100 text-lg leading-relaxed mb-10 max-w-2xl mx-auto anim-fade-up delay-200">
          Mulai konsultasikan usaha Anda dan dapatkan pendampingan yang lebih mudah, cepat, dan terpercaya bersama tim HalalPro.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 anim-fade-up delay-300">
          <a
            href={getWhatsAppUrl('Halo, saya ingin konsultasi mengenai sertifikasi halal untuk usaha saya. Mohon informasinya.')}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-green-700 font-black rounded-2xl hover:bg-green-50 transition-all shadow-2xl text-base active:scale-[0.97]"
          >
            <Phone className="w-4.5 h-4.5" />
            💬 Konsultasi via WhatsApp
          </a>
          <Link
            href="/ajukan"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/15 text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/25 transition-all text-base backdrop-blur-sm"
          >
            Ajukan Sekarang
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto anim-fade-up delay-400">
          {[
            { label: 'WhatsApp', value: '0831-7251-9500' },
            { label: 'Layanan', value: 'Senin – Sabtu' },
            { label: 'Jam Kerja', value: '08.00 – 17.00 WIB' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 border border-white/15 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-green-200 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
              <p className="text-white font-bold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBanner />
      <ProblemSolutionSection />
      <ServicesSection />
      <ProcessSection />
      <PackagesSection />
      <CertificatesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
