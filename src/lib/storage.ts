/**
 * Storage abstraction — swap backend without changing callers.
 * Currently: local filesystem at public/uploads/<category>/<filename>
 * Future: point to Cloudinary / S3 / Supabase by replacing this file.
 */

import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export type StorageCategory = 'testimonials' | 'certificates' | 'documents'

// Allowed MIME types for image uploads (testimonials/certificates)
export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp']
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

/**
 * Save a file to public/uploads/<category>/ and return its public URL.
 * The stored filename is a UUID to prevent path traversal and collisions.
 */
export async function saveUploadedFile(
  file: File,
  category: StorageCategory
): Promise<string> {
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

function getExtFromMime(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  }
  return map[mimeType] ?? 'bin'
}
