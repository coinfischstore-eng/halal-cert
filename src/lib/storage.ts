/**
 * Storage abstraction — local filesystem for dev, Cloudinary for production.
 *
 * Set CLOUDINARY_URL in environment to enable Cloudinary.
 * Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 *
 * Without CLOUDINARY_URL the code falls back to public/uploads/<category>/<filename>
 * (suitable for local development only — Netlify filesystem is ephemeral).
 */

import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export type StorageCategory = 'testimonials' | 'certificates' | 'documents'

// Allowed MIME types for image uploads (testimonials / certificates)
export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp']
// Allowed MIME types for document uploads
export const ALLOWED_DOCUMENT_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
    return 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'Ukuran file maksimal 5 MB.'
  }
  return null
}

/** Derive a safe extension from MIME type (prevents path traversal via filename) */
function getExtFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  }
  return map[mimeType] ?? 'bin'
}

// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary upload
// ─────────────────────────────────────────────────────────────────────────────

async function uploadToCloudinary(file: File, category: StorageCategory): Promise<string> {
  const { v2: cloudinary } = await import('cloudinary')
  // cloudinary is configured via CLOUDINARY_URL env var automatically
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `halalpro/${category}`,
        resource_type: 'auto',
        public_id: uuidv4(),
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'))
        } else {
          resolve(result.secure_url)
        }
      }
    )
    uploadStream.end(buffer)
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Local filesystem upload (dev only)
// ─────────────────────────────────────────────────────────────────────────────

async function uploadToLocal(file: File, category: StorageCategory): Promise<string> {
  const { writeFile, mkdir } = await import('fs/promises')
  const { existsSync } = await import('fs')

  const ext = getExtFromMime(file.type)
  const filename = `${uuidv4()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', category)

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

  return `/uploads/${category}/${filename}`
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Save a file to cloud storage (Cloudinary) or local filesystem (dev).
 * Returns a publicly accessible URL.
 */
export async function saveUploadedFile(file: File, category: StorageCategory): Promise<string> {
  if (process.env.CLOUDINARY_URL) {
    return uploadToCloudinary(file, category)
  }
  return uploadToLocal(file, category)
}

/**
 * Save a document file (allows PDF in addition to images).
 * Uses same storage backend as saveUploadedFile.
 */
export async function saveDocumentFile(file: File, applicationId: string): Promise<string> {
  if (process.env.CLOUDINARY_URL) {
    const { v2: cloudinary } = await import('cloudinary')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = getExtFromMime(file.type)
    const publicId = `${uuidv4()}.${ext}`

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `halalpro/documents/${applicationId}`,
          resource_type: file.type === 'application/pdf' ? 'raw' : 'image',
          public_id: publicId,
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary upload failed'))
          } else {
            resolve(result.secure_url)
          }
        }
      )
      uploadStream.end(buffer)
    })
  }

  // Local fallback
  const { writeFile, mkdir } = await import('fs/promises')
  const { existsSync } = await import('fs')

  const ext = getExtFromMime(file.type)
  const filename = `${uuidv4()}.${ext}`
  const uploadDir = path.join(process.cwd(), 'uploads', applicationId)

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const bytes = await file.arrayBuffer()
  await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))

  return `/api/admin/documents/serve/${filename}?appId=${applicationId}`
}
