import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar admin={session} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
