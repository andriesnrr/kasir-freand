import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'text-label px-2 py-0.5 rounded-full font-medium',
      {
        'bg-surface-container-high text-on-surface-variant': variant === 'default',
        'bg-secondary/20 text-secondary': variant === 'success',
        'bg-tertiary/20 text-tertiary': variant === 'warning',
        'bg-error-container/50 text-error': variant === 'error',
        'bg-primary/20 text-primary': variant === 'info',
      },
      className
    )}>
      {children}
    </span>
  )
}
