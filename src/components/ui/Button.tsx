'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive' | 'white'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap'

    const variants = {
      primary: 'bg-green-600 text-white border-2 border-green-600 hover:bg-green-700 hover:border-green-700 active:scale-[0.98]',
      outline: 'bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white active:scale-[0.98]',
      ghost: 'bg-transparent text-gray-600 border-2 border-transparent hover:bg-gray-100 hover:text-gray-900',
      destructive: 'bg-red-600 text-white border-2 border-red-600 hover:bg-red-700 hover:border-red-700 active:scale-[0.98]',
      white: 'bg-white text-green-700 border-2 border-white hover:bg-green-50 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-[0.9375rem]',
      lg: 'px-7 py-3.5 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
