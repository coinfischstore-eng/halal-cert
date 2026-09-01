#!/usr/bin/env node
/**
 * Tampilkan environment variables untuk dimasukkan ke Netlify.
 * Script ini HANYA dijalankan secara lokal — jangan commit atau share outputnya.
 * Run: node scripts/show-netlify-env.cjs
 */

const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local tidak ditemukan')
  process.exit(1)
}

const lines = fs.readFileSync(envPath, 'utf8').split('\n')
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

console.log('\n' + '='.repeat(60))
console.log('NETLIFY ENVIRONMENT VARIABLES')
console.log('Salin nilai-nilai ini ke Netlify > Site > Environment variables')
console.log('='.repeat(60) + '\n')

const keys = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'CLOUDINARY_URL', 'MAX_FILE_SIZE_MB']
for (const key of keys) {
  const val = env[key] || ''
  if (!val) {
    console.log(`${key}=  ⚠️  KOSONG`)
  } else {
    console.log(`${key}=${val}`)
  }
}

console.log('\nNEXTAUTH_URL=  ← ISI DENGAN URL NETLIFY ANDA')
console.log('  Contoh: https://amazing-halva-123456.netlify.app')
console.log('\n' + '='.repeat(60))
console.log('⚠️  JANGAN share output ini. Tutup terminal setelah selesai.')
console.log('='.repeat(60) + '\n')
