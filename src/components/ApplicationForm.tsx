'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  Package,
  Copy,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { BUSINESS_TYPES, BUSINESS_CATEGORIES, getWhatsAppUrl } from '@/lib/types'

const step1Schema = z.object({
  customerName: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  whatsapp: z.string().min(9, 'Nomor WhatsApp tidak valid').max(20),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  city: z.string().max(100).optional(),
})

const step2Schema = z.object({
  businessName: z.string().min(2, 'Nama usaha minimal 2 karakter').max(200),
  businessType: z.string().min(1, 'Pilih jenis usaha'),
  businessCategory: z.string().min(1, 'Pilih kategori usaha'),
  businessAddress: z.string().max(500).optional(),
  productCount: z.coerce.number().int().min(1, 'Minimal 1 produk').max(9999),
  productNames: z.string().max(1000).optional(),
  hasNIB: z.boolean(),
  hasIngredientDocs: z.boolean(),
})

const fullSchema = step1Schema.merge(step2Schema).extend({
  packageId: z.string().optional(),
})

type FormData = z.infer<typeof fullSchema>

const STEPS = [
  { id: 1, label: 'Data Pemilik', icon: User },
  { id: 2, label: 'Data Usaha', icon: Building2 },
  { id: 3, label: 'Konfirmasi', icon: CheckCircle2 },
]

interface PackageOption {
  id: string
  name: string
  description: string
  priceLabel: string | null
  price: number
  isFeatured: boolean
}

export function ApplicationForm({ packages }: { packages: PackageOption[] }) {
  const searchParams = useSearchParams()
  const { success, error: toastError } = useToast()

  const defaultPackage = packages.find((p) => p.id === searchParams.get('packageId'))?.id || ''

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      packageId: defaultPackage,
      productCount: 1,
      hasNIB: false,
      hasIngredientDocs: false,
    },
  })

  const selectedPackageId = watch('packageId')

  async function nextStep() {
    let valid = false
    if (step === 1) {
      valid = await trigger(['customerName', 'whatsapp', 'email', 'city'])
    } else if (step === 2) {
      valid = await trigger([
        'businessName', 'businessType', 'businessCategory',
        'businessAddress', 'productCount', 'productNames',
        'hasNIB', 'hasIngredientDocs',
      ])
    }
    if (valid) setStep((s) => s + 1)
  }

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        toastError('Pengajuan gagal', json.error || 'Terjadi kesalahan')
        return
      }
      setSubmittedCode(json.code)
      success('Pengajuan berhasil!', `Kode pengajuan: ${json.code}`)
    } catch {
      toastError('Kesalahan jaringan', 'Periksa koneksi internet Anda')
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    if (submittedCode) {
      navigator.clipboard.writeText(submittedCode)
      success('Disalin!', 'Kode pengajuan telah disalin')
    }
  }

  // ── Success screen ──────────────────────────────────────────────
  if (submittedCode) {
    const waMsg = `Halo, saya baru saja mengajukan pendampingan sertifikasi halal.\n\nKode Pengajuan: ${submittedCode}\n\nMohon konfirmasinya. Terima kasih.`
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Berhasil!</h2>
        <p className="text-gray-500 mb-6">
          Pengajuan pendampingan sertifikasi halal Anda telah kami terima. Tim kami akan segera menghubungi Anda.
        </p>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 mb-6">
          <p className="text-sm text-green-700 font-medium mb-2">Kode Pengajuan Anda:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-bold text-green-800 font-mono tracking-widest">{submittedCode}</span>
            <button onClick={copyCode} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-green-600 mt-2">Simpan kode ini untuk memantau status pengajuan Anda.</p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={getWhatsAppUrl(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Konfirmasi via WhatsApp
          </a>
          <Link
            href={`/tracking?code=${submittedCode}`}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-200 hover:border-green-400 transition-colors"
          >
            Pantau Status Pengajuan
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const formValues = getValues()

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl mx-auto">
      {/* Progress */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${step >= s.id ? 'text-green-600' : 'text-gray-400'}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    step > s.id
                      ? 'bg-green-600 text-white'
                      : step === s.id
                      ? 'bg-green-600 text-white ring-4 ring-green-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s.id ? 'text-green-700' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* ── Step 1: Customer Data ── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Data Pemilik / Penanggung Jawab</h2>
              <p className="text-sm text-gray-500">Isi data diri Anda sebagai penanggung jawab pengajuan.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                {...register('customerName')}
                placeholder="Nama lengkap Anda"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                {...register('whatsapp')}
                placeholder="Contoh: 08123456789"
                type="tel"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-xs text-gray-400">Gunakan nomor aktif. Digunakan untuk verifikasi dan komunikasi.</p>
              {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Opsional)</label>
              <input
                {...register('email')}
                type="email"
                placeholder="email@contoh.com"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kota / Kabupaten (Opsional)</label>
              <input
                {...register('city')}
                placeholder="Contoh: Surabaya"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Business Data ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Data Usaha &amp; Produk</h2>
              <p className="text-sm text-gray-500">Isi informasi usaha dan produk yang akan disertifikasi.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Usaha <span className="text-red-500">*</span>
              </label>
              <input
                {...register('businessName')}
                placeholder="Nama usaha / brand Anda"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              {errors.businessName && <p className="mt-1 text-xs text-red-500">{errors.businessName.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jenis Usaha <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('businessType')}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-all"
                >
                  <option value="">Pilih jenis usaha</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.businessType && <p className="mt-1 text-xs text-red-500">{errors.businessType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori Produk <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('businessCategory')}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-all"
                >
                  <option value="">Pilih kategori</option>
                  {BUSINESS_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.businessCategory && <p className="mt-1 text-xs text-red-500">{errors.businessCategory.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Usaha (Opsional)</label>
              <input
                {...register('businessAddress')}
                placeholder="Alamat tempat produksi/usaha"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Jumlah Produk <span className="text-red-500">*</span>
              </label>
              <input
                {...register('productCount')}
                type="number"
                min={1}
                max={9999}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              {errors.productCount && <p className="mt-1 text-xs text-red-500">{errors.productCount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama-Nama Produk (Opsional)</label>
              <textarea
                {...register('productNames')}
                rows={3}
                placeholder="Sebutkan nama produk yang akan disertifikasi, pisahkan dengan koma"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">Kelengkapan Awal Dokumen</p>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('hasNIB')}
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Sudah memiliki NIB (Nomor Induk Berusaha)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('hasIngredientDocs')}
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Sudah memiliki daftar bahan baku</span>
              </label>
            </div>

            {/* Package selection */}
            {packages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Paket (Opsional)</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:border-green-300 transition-colors border-gray-100">
                    <input
                      type="radio"
                      value=""
                      checked={!selectedPackageId}
                      onChange={() => setValue('packageId', '')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">Belum tentukan paket</span>
                  </label>
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer hover:border-green-300 transition-colors ${
                        selectedPackageId === pkg.id ? 'border-green-500 bg-green-50' : 'border-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        value={pkg.id}
                        checked={selectedPackageId === pkg.id}
                        onChange={() => setValue('packageId', pkg.id)}
                        className="text-green-600 focus:ring-green-500 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{pkg.name}</span>
                          {pkg.isFeatured && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                              Populer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{pkg.description}</p>
                        <p className="text-xs font-semibold text-green-600 mt-1">{pkg.priceLabel || 'Hubungi Kami'}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Confirmation ── */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Konfirmasi Pengajuan</h2>
              <p className="text-sm text-gray-500">Periksa kembali data Anda sebelum mengirim.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Data Pemilik
                </p>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Nama</dt>
                    <dd className="font-medium text-gray-900 text-right">{formValues.customerName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">WhatsApp</dt>
                    <dd className="font-medium text-gray-900">{formValues.whatsapp}</dd>
                  </div>
                  {formValues.email && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Email</dt>
                      <dd className="font-medium text-gray-900">{formValues.email}</dd>
                    </div>
                  )}
                  {formValues.city && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Kota</dt>
                      <dd className="font-medium text-gray-900">{formValues.city}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Data Usaha
                </p>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Nama Usaha</dt>
                    <dd className="font-medium text-gray-900 text-right">{formValues.businessName}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Jenis Usaha</dt>
                    <dd className="font-medium text-gray-900 text-right">{formValues.businessType}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Kategori</dt>
                    <dd className="font-medium text-gray-900 text-right">{formValues.businessCategory}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Jumlah Produk</dt>
                    <dd className="font-medium text-gray-900">{formValues.productCount} produk</dd>
                  </div>
                  {formValues.productNames && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-gray-500">Nama Produk</dt>
                      <dd className="font-medium text-gray-900 text-right">{formValues.productNames}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {selectedPackageId && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" /> Paket Dipilih
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {packages.find((p) => p.id === selectedPackageId)?.name}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-medium mb-1">⚠️ Persetujuan</p>
              <p>
                Dengan mengirim formulir ini, Anda menyetujui{' '}
                <Link href="/syarat-ketentuan" target="_blank" className="text-green-600 underline">Syarat &amp; Ketentuan</Link>{' '}
                dan{' '}
                <Link href="/kebijakan-privasi" target="_blank" className="text-green-600 underline">Kebijakan Privasi</Link>{' '}
                layanan kami.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Sebelumnya
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4" />
              Beranda
            </Link>
          )}

          {step < 3 ? (
            <Button type="button" onClick={nextStep} className="min-w-[140px]">
              Lanjut
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" loading={loading} className="min-w-[160px]">
              {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
