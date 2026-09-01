import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession, setSessionCookie } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email atau password tidak valid' }, { status: 400 })
    }

    const { email, password } = parsed.data

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const token = await createSession({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    })

    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
