import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-label text-on-surface-variant">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">{icon}</span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-surface-container-high rounded-xl px-4 py-3 text-body-md text-on-surface placeholder:text-outline border border-outline-variant/50 focus:border-primary focus:outline-none transition-colors',
            icon && 'pl-10',
            error && 'border-error',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-label text-error">{error}</span>}
    </div>
  )
})
Input.displayName = 'Input'
export default Input
