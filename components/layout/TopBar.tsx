'use client'
import { useAuthStore } from '@/lib/store/authStore'

interface TopBarProps {
  title: string
  right?: React.ReactNode
}

export default function TopBar({ title, right }: TopBarProps) {
  const user = useAuthStore((s) => s.currentUser)
  const shift = useAuthStore((s) => s.currentShift)

  return (
    <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between">
        <span className="font-display text-title gradient-text">{title}</span>
        <div className="flex items-center gap-2">
          {right}
          {user && (
            <div className="flex items-center gap-2">
              {shift && (
                <span className="text-label px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">Shift aktif</span>
              )}
              <span className="text-label text-on-surface-variant">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
