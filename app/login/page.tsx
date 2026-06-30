'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/authStore'
import { useSettingStore } from '@/lib/store/settingStore'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const users = useSettingStore((s) => s.users)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (isLoggedIn) router.replace('/kasir')
  }, [isLoggedIn, router])
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)

  const selectedUser = users.find((u) => u.id === selectedId)

  const handleKey = useCallback((key: string) => {
    if (key === 'del') {
      setPin((p) => p.slice(0, -1))
      return
    }
    if (pin.length >= 4) return
    const next = pin + key
    setPin(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (selectedUser && selectedUser.pin === next) {
          login(selectedUser)
          router.push('/kasir')
          toast.success(`Selamat datang, ${selectedUser.name}!`)
        } else {
          setShake(true)
          setPin('')
          toast.error('PIN salah')
          setTimeout(() => setShake(false), 500)
        }
      }, 100)
    }
  }, [pin, selectedUser, login, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-primary gradient-blob pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-secondary gradient-blob pointer-events-none" />

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center mb-3">
          <span className="font-display text-display-sm text-on-primary font-bold">KF</span>
        </div>
        <h1 className="font-display text-display-sm gradient-text">Kasir Freand</h1>
        <p className="text-body-md text-on-surface-variant mt-1">Pilih kasir dan masukkan PIN</p>
      </div>

      {/* User selector */}
      <div className="flex gap-3 mb-8">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => { setSelectedId(user.id); setPin('') }}
            className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all border-2 ${
              selectedId === user.id
                ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(196,192,255,0.3)]'
                : 'border-outline-variant bg-surface-container'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-body-lg font-bold ${
              user.role === 'owner' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
            }`}>
              {user.name[0]}
            </div>
            <span className="text-label text-on-surface">{user.name}</span>
            {user.role === 'owner' && (
              <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Owner</span>
            )}
          </button>
        ))}
      </div>

      {/* PIN dots */}
      <div className={`flex gap-4 mb-8 ${shake ? 'animate-shake' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < pin.length ? 'bg-primary scale-110' : 'bg-outline-variant'
            }`}
          />
        ))}
      </div>

      {/* Keypad */}
      {selectedUser ? (
        <div className="grid grid-cols-3 gap-3 w-64">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, idx) => (
            key === '' ? (
              <div key={idx} />
            ) : (
              <button
                key={idx}
                onClick={() => handleKey(key)}
                className={`w-full h-14 rounded-2xl text-title font-semibold transition-all active:scale-95 ${
                  key === 'del'
                    ? 'bg-surface-container-high text-outline'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {key === 'del' ? '⌫' : key}
              </button>
            )
          ))}
        </div>
      ) : (
        <p className="text-body-md text-outline">Pilih kasir terlebih dahulu</p>
      )}
    </div>
  )
}
