import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ variant = 'gradient', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50',
        {
          'gradient-btn text-on-primary': variant === 'gradient',
          'border border-primary/50 text-primary bg-primary/10 hover:bg-primary/20': variant === 'outline',
          'text-on-surface-variant hover:bg-surface-container-high': variant === 'ghost',
          'bg-error-container text-error hover:opacity-80': variant === 'danger',
        },
        {
          'px-3 py-1.5 text-label': size === 'sm',
          'px-4 py-3 text-body-md': size === 'md',
          'px-6 py-4 text-body-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
