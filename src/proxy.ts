import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('halal_admin_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    const session = await verifySession(token)
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
