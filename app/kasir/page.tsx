'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import BottomNav from '@/components/layout/BottomNav'
import ProductGrid from '@/components/kasir/ProductGrid'
import CartBar from '@/components/kasir/CartBar'
import CartSheet from '@/components/kasir/CartSheet'
import CheckoutModal from '@/components/kasir/CheckoutModal'
import ReceiptView from '@/components/kasir/ReceiptView'
import type { Transaction } from '@/lib/types'

export default function KasirPage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const user = useAuthStore((s) => s.currentUser)
  const userRole = useAuthStore((s) => s.currentUser?.role) // scalar for effect dep
  const openShift = useAuthStore((s) => s.openShift)
  const currentShift = useAuthStore((s) => s.currentShift)

  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [receipt, setReceipt] = useState<Transaction | null>(null)
  const [kasAwalOpen, setKasAwalOpen] = useState(false) // POLISH: 4
  const [kasAwalInput, setKasAwalInput] = useState('')

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  useEffect(() => {
    if (isLoggedIn && !currentShift) {
      if (user?.role === 'owner') setKasAwalOpen(true) // POLISH: 4
      else openShift(0)
    }
  }, [isLoggedIn, currentShift, openShift, user])

  if (!isLoggedIn || !user) return null

  if (receipt) {
    return <ReceiptView tx={receipt} onNew={() => setReceipt(null)} />
  }

  return (
    <div className="min-h-screen pb-20">
      {/* TopBar */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between">
          <span className="font-display text-title gradient-text">Kasir Freand</span>
          <div className="flex items-center gap-2">
            <span className="text-label px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">Shift aktif</span>
            <span className="text-label text-on-surface-variant">{user.name}</span>
          </div>
        </div>
      </div>

      <ProductGrid />

      <CartBar onOpen={() => setCartOpen(true)} />

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true) }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={(tx) => { setCheckoutOpen(false); setReceipt(tx) }}
      />

      <BottomNav />

      {/* POLISH: 4 — kas awal modal for owner */}
      {kasAwalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
          <div className="w-full max-w-[480px] bg-surface-container rounded-t-3xl p-6 flex flex-col gap-4">
            <p className="font-display text-title gradient-text">Buka Shift</p>
            <p className="text-body-md text-on-surface-variant">Masukkan jumlah kas awal</p>
            <input
              type="number"
              placeholder="0"
              value={kasAwalInput}
              onChange={(e) => setKasAwalInput(e.target.value)}
              className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => { openShift(Number(kasAwalInput) || 0); setKasAwalOpen(false) }}
              className="w-full py-4 rounded-2xl gradient-btn text-on-primary font-semibold text-body-md"
            >
              Buka Shift
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
