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
  const openShift = useAuthStore((s) => s.openShift)
  const currentShift = useAuthStore((s) => s.currentShift)

  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [receipt, setReceipt] = useState<Transaction | null>(null)

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  useEffect(() => {
    if (isLoggedIn && !currentShift) openShift(0)
  }, [isLoggedIn, currentShift, openShift])

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
    </div>
  )
}
