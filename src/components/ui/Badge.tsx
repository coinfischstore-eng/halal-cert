import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'blue' | 'yellow' | 'orange' | 'red' | 'gray' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// Application status → badge variant mapping
import type { ApplicationStatus } from '@/lib/types'
import { APPLICATION_STATUS_LABELS } from '@/lib/types'

export function ApplicationStatusBadge({ status }: { status: string }) {
  const variantMap: Record<ApplicationStatus, BadgeProps['variant']> = {
    PENGAJUAN_DITERIMA: 'blue',
    MENUNGGU_DOKUMEN: 'yellow',
    VERIFIKASI_DOKUMEN: 'orange',
    DOKUMEN_LENGKAP: 'green',
    DALAM_PROSES_PENDAMPINGAN: 'purple',
    PENGAJUAN_DIPROSES: 'purple',
    MENUNGGU_PROSES_RESMI: 'orange',
    SELESAI: 'green',
  }

  const label = APPLICATION_STATUS_LABELS[status as ApplicationStatus] ?? status
  const variant = variantMap[status as ApplicationStatus] ?? 'gray'

  return <Badge variant={variant}>{label}</Badge>
}
