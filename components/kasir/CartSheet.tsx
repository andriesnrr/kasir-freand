'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import CartItemComponent from './CartItem'
import { useCartStore } from '@/lib/store/cartStore'
import { useSettingStore } from '@/lib/store/settingStore'
import { formatRupiah } from '@/lib/utils'
import type { DiscountType } from '@/lib/types'

interface CartSheetProps {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}

export default function CartSheet({ open, onClose, onCheckout }: CartSheetProps) {
  const { items, globalDiscount, discountType, holds, setGlobalDiscount, holdCart, restoreHold, deleteHold } = useCartStore()
  const subtotal = useCartStore((s) => s.subtotal())
  const ppnAmount = useCartStore((s) => s.ppnAmount())
  const discountAmount = useCartStore((s) => s.discountAmount())
  const total = useCartStore((s) => s.total())
  const ppnSettings = useSettingStore((s) => s.ppn)
  const [showHolds, setShowHolds] = useState(false)

  const handleHold = () => {
    holdCart()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Keranjang" maxHeight="90vh">
      <div className="px-4 pb-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <span className="material-symbols-outlined text-[48px] text-outline mb-3">shopping_basket</span>
            <p className="text-headline text-on-surface">Keranjang kosong</p>
            <p className="text-body-md text-on-surface-variant">Tap produk untuk menambahkan</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="mb-4">
              {items.map((item, idx) => (
                <CartItemComponent key={`${item.productId}-${item.variantId}-${idx}`} item={item} />
              ))}
            </div>

            {/* PPN row */}
            {ppnSettings.enabled && ppnAmount > 0 && (
              <div className="flex justify-between text-body-md text-on-surface-variant mb-2">
                <span>PPN {ppnSettings.rate}% ({ppnSettings.mode})</span>
                <span>{formatRupiah(ppnAmount)}</span>
              </div>
            )}

            {/* Global discount */}
            <div className="glass-card p-3 mb-4">
              <p className="text-label text-on-surface-variant mb-2">Diskon Global</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Nominal"
                  value={globalDiscount || ''}
                  onChange={(e) => setGlobalDiscount(Number(e.target.value), discountType)}
                  className="flex-1 bg-surface-container rounded-xl px-3 py-2 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
                />
                <div className="flex rounded-xl overflow-hidden border border-outline-variant/50">
                  {(['nominal', 'persen'] as DiscountType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setGlobalDiscount(globalDiscount, type)}
                      className={`px-3 py-2 text-label font-medium transition-colors ${
                        discountType === type ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {type === 'nominal' ? 'Rp' : '%'}
                    </button>
                  ))}
                </div>
              </div>
              {discountAmount > 0 && (
                <p className="text-label text-secondary mt-1">Diskon: -{formatRupiah(discountAmount)}</p>
              )}
            </div>

            {/* Subtotal row */}
            <div className="flex justify-between text-body-md text-on-surface-variant mb-1">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>

            {/* Total */}
            <div className="flex justify-between text-title font-bold text-on-surface mb-4">
              <span>Total</span>
              <span className="gradient-text">{formatRupiah(total)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleHold}
                className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-body-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                Tahan
              </button>
              <button
                onClick={onCheckout}
                className="flex-[2] py-3 rounded-2xl gradient-btn text-on-primary text-body-md font-semibold active:scale-95 transition-all"
              >
                Lanjut Checkout
              </button>
            </div>
          </>
        )}

        {/* Holds list */}
        {holds.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowHolds(!showHolds)}
              className="flex items-center gap-2 text-label text-primary mb-2"
            >
              <span className="material-symbols-outlined text-[16px]">pause_circle</span>
              {holds.length} transaksi ditahan
            </button>
            {showHolds && holds.map((h) => (
              <div key={h.id} className="glass-card p-3 mb-2 flex items-center justify-between">
                <div>
                  <p className="text-body-md text-on-surface">{h.items.length} item</p>
                  <p className="text-label text-on-surface-variant">{new Date(h.createdAt).toLocaleTimeString('id-ID')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { restoreHold(h.id); onClose() }} className="text-label text-primary bg-primary/10 px-2 py-1 rounded-lg">Pulihkan</button>
                  <button onClick={() => deleteHold(h.id)} className="text-label text-error bg-error-container/20 px-2 py-1 rounded-lg">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
