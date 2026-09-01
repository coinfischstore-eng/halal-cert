import Link from 'next/link'
import { ShieldCheck, MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { getWhatsAppUrl, DEFAULT_WA_MESSAGE } from '@/lib/types'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/50">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg leading-none">HalalPro</span>
                <span className="block text-[10px] text-green-400 font-semibold leading-none">Jasa Pendampingan Sertifikasi Halal</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-5">
              Layanan pendampingan profesional untuk pengurusan sertifikasi halal produk Anda. Membantu UMKM dan pelaku usaha dari persiapan dokumen hingga sertifikasi selesai.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-green-400" />
                </div>
                <a href={getWhatsAppUrl(DEFAULT_WA_MESSAGE)} target="_blank" rel="noopener noreferrer" className="text-sm text-green-400 hover:text-green-300 font-medium transition-colors">
                  0831-7251-9500 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-sm">info@halalpro.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-sm">Indonesia</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Layanan</h3>
            <ul className="space-y-3 text-sm">
              {[
                ['/#layanan', 'Layanan Kami'],
                ['/#paket', 'Paket & Harga'],
                ['/#proses', 'Alur Proses'],
                ['/#sertifikat', 'Portofolio'],
                ['/#testimoni', 'Testimoni'],
                ['/#faq', 'FAQ'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-green-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-green-400 transition-opacity -ml-0.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Pelanggan</h3>
            <ul className="space-y-3 text-sm">
              {[
                ['/ajukan', 'Ajukan Pendampingan'],
                ['/tracking', 'Cek Status Pengajuan'],
                ['/kebijakan-privasi', 'Kebijakan Privasi'],
                ['/syarat-ketentuan', 'Syarat & Ketentuan'],
                ['/disclaimer', 'Disclaimer'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-green-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-green-400 transition-opacity -ml-0.5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800 pt-6 pb-4">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            ⚠️{' '}
            <strong className="text-slate-400">Disclaimer:</strong>{' '}
            HalalPro adalah layanan jasa pendampingan swasta — bukan BPJPH, MUI, atau lembaga pemerintah. Sertifikat halal resmi diterbitkan oleh BPJPH melalui mekanisme yang berlaku.{' '}
            <Link href="/disclaimer" className="text-green-500 hover:underline">Baca selengkapnya</Link>
          </p>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800/50 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} HalalPro. Seluruh hak cipta dilindungi.
          </p>
          <p className="text-xs text-slate-600">Layanan Pendampingan Sertifikasi Halal</p>
        </div>
      </div>
    </footer>
  )
}
