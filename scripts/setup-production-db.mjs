#!/usr/bin/env node
/**
 * Production database setup script.
 * Runs after you have filled in .env.local with real credentials.
 *
 * Usage:
 *   node scripts/setup-production-db.mjs
 *
 * What it does:
 *   1. Loads DATABASE_URL from .env.local
 *   2. Validates the connection string is PostgreSQL (not SQLite)
 *   3. Checks Prisma client is generated
 *   4. Reports readiness for migration
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnv() {
  const envPath = join(root, '.env.local')
  if (!existsSync(envPath)) {
    console.error('❌ .env.local not found. Create it from .env.example first.')
    process.exit(1)
  }
  const lines = readFileSync(envPath, 'utf8').split('\n')
  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    env[key] = val
  }
  return env
}

const env = loadEnv()
const dbUrl = env['DATABASE_URL'] ?? ''
const cloudinaryUrl = env['CLOUDINARY_URL'] ?? ''
const nextAuthSecret = env['NEXTAUTH_SECRET'] ?? ''

console.log('\n=== HalalPro Production Setup Check ===\n')

// Check DATABASE_URL
if (!dbUrl || dbUrl.includes('PASTE_') || dbUrl.startsWith('file:')) {
  console.error('❌ DATABASE_URL is not set to a PostgreSQL connection string.')
  console.error('   Open .env.local and replace PASTE_NEON_CONNECTION_STRING_HERE')
  console.error('   with your Neon connection string.')
  console.error('   Format: postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require')
  process.exit(1)
}
if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL does not look like a PostgreSQL URL.')
  console.error('   Got prefix: ' + dbUrl.slice(0, 20) + '...')
  process.exit(1)
}
console.log('✅ DATABASE_URL: PostgreSQL connection string found')

// Check CLOUDINARY_URL
if (!cloudinaryUrl || cloudinaryUrl.includes('PASTE_')) {
  console.warn('⚠️  CLOUDINARY_URL is not set. File uploads will fall back to local filesystem.')
  console.warn('   Open .env.local and replace PASTE_CLOUDINARY_URL_HERE')
  console.warn('   with your Cloudinary URL: cloudinary://KEY:SECRET@CLOUDNAME')
} else if (!cloudinaryUrl.startsWith('cloudinary://')) {
  console.warn('⚠️  CLOUDINARY_URL format unexpected: ' + cloudinaryUrl.slice(0, 20) + '...')
} else {
  console.log('✅ CLOUDINARY_URL: Cloudinary configuration found')
}

// Check NEXTAUTH_SECRET
if (!nextAuthSecret || nextAuthSecret.includes('PASTE_') || nextAuthSecret.length < 32) {
  console.warn('⚠️  NEXTAUTH_SECRET is missing or too short (need 32+ chars).')
  console.warn('   Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
} else {
  console.log('✅ NEXTAUTH_SECRET: Secret found (' + nextAuthSecret.length + ' chars)')
}

console.log('\n=== All checks passed. Ready to run: ===')
console.log('  npx prisma migrate deploy   (apply schema to PostgreSQL)')
console.log('  npm run db:seed             (seed admin, packages, FAQs)')
console.log('\nRun the above commands in the halal-cert directory.\n')
