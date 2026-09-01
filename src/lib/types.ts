// Application-wide TypeScript types

export type ApplicationStatus =
  | 'PENGAJUAN_DITERIMA'
  | 'MENUNGGU_DOKUMEN'
  | 'VERIFIKASI_DOKUMEN'
  | 'DOKUMEN_LENGKAP'
  | 'DALAM_PROSES_PENDAMPINGAN'
  | 'PENGAJUAN_DIPROSES'
  | 'MENUNGGU_PROSES_RESMI'
  | 'SELESAI'

export type DocumentType = 'NIB' | 'KTP' | 'INGREDIENT_LIST' | 'PRODUCT_PHOTO' | 'OTHER'
export type DocumentStatus = 'UPLOADED' | 'NEEDS_REVISION' | 'VALID'
export type AdminRole = 'ADMIN' | 'SUPERADMIN'

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENGAJUAN_DITERIMA: 'Pengajuan Diterima',
  MENUNGGU_DOKUMEN: 'Menunggu Dokumen',
  VERIFIKASI_DOKUMEN: 'Verifikasi Dokumen',
  DOKUMEN_LENGKAP: 'Dokumen Lengkap',
  DALAM_PROSES_PENDAMPINGAN: 'Dalam Proses Pendampingan',
  PENGAJUAN_DIPROSES: 'Pengajuan Diproses',
  MENUNGGU_PROSES_RESMI: 'Menunggu Proses Resmi',
  SELESAI: 'Selesai',
}

export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  'PENGAJUAN_DITERIMA',
  'MENUNGGU_DOKUMEN',
  'VERIFIKASI_DOKUMEN',
  'DOKUMEN_LENGKAP',
  'DALAM_PROSES_PENDAMPINGAN',
  'PENGAJUAN_DIPROSES',
  'MENUNGGU_PROSES_RESMI',
  'SELESAI',
]

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  NIB: 'NIB (Nomor Induk Berusaha)',
  KTP: 'KTP / Identitas Pemilik',
  INGREDIENT_LIST: 'Daftar Bahan Baku',
  PRODUCT_PHOTO: 'Foto Produk',
  OTHER: 'Dokumen Lainnya',
}

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  UPLOADED: 'Sudah Upload',
  NEEDS_REVISION: 'Perlu Diperbaiki',
  VALID: 'Valid',
}

export const BUSINESS_TYPES = [
  'Perorangan / Individu',
  'Usaha Dagang (UD)',
  'CV (Commanditaire Vennootschap)',
  'PT (Perseroan Terbatas)',
  'Koperasi',
  'Yayasan',
  'Lainnya',
]

export const BUSINESS_CATEGORIES = [
  'Makanan & Minuman',
  'Kosmetik & Perawatan Tubuh',
  'Farmasi & Suplemen',
  'Produk Rumah Tangga',
  'Jasa Boga / Katering',
  'Restoran / Rumah Makan',
  'Oleh-oleh / Souvenir Makanan',
  'Lainnya',
]

export const WA_NUMBER = '6283172519500'
export const WA_BASE_URL = `https://wa.me/${WA_NUMBER}`

export function getWhatsAppUrl(message?: string) {
  if (message) {
    return `${WA_BASE_URL}?text=${encodeURIComponent(message)}`
  }
  return WA_BASE_URL
}

export const DEFAULT_WA_MESSAGE =
  'Halo, saya ingin berkonsultasi mengenai pendampingan sertifikasi halal.\n\nNama:\nNama Usaha:\nJenis Usaha:\nJumlah Produk:\n\nMohon informasi selanjutnya.'
