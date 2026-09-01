import { prisma } from './prisma'

/**
 * Generate a unique application code: HALAL-YYYY-NNNNN
 * Uses a database sequence to guarantee uniqueness
 */
export async function generateApplicationCode(): Promise<string> {
  const year = new Date().getFullYear()

  // Use a transaction to atomically increment the sequence
  const sequence = await prisma.$transaction(async (tx) => {
    const seq = await tx.applicationSequence.upsert({
      where: { id: 'singleton' },
      update: {
        lastSeq: { increment: 1 },
        year,
      },
      create: {
        id: 'singleton',
        year,
        lastSeq: 1,
      },
    })
    return seq
  })

  const paddedSeq = String(sequence.lastSeq).padStart(5, '0')
  return `HALAL-${year}-${paddedSeq}`
}

/**
 * Format IDR currency
 */
export function formatCurrency(amount: number): string {
  if (amount === 0) return 'Hubungi Kami'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Sanitize string input — strip leading/trailing whitespace, limit length
 */
export function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

/**
 * Validate Indonesian WhatsApp number
 * Accepts: 08xxx, 628xxx, +628xxx
 * Returns normalized 628xxx format or null if invalid
 */
export function normalizeWhatsApp(raw: string): string | null {
  const cleaned = raw.replace(/[\s\-().+]/g, '')
  if (/^08\d{8,12}$/.test(cleaned)) {
    return '62' + cleaned.slice(1)
  }
  if (/^628\d{8,12}$/.test(cleaned)) {
    return cleaned
  }
  if (/^8\d{8,12}$/.test(cleaned)) {
    return '62' + cleaned
  }
  return null
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Allowed MIME types for document upload
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export function isAllowedFileType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType)
}
