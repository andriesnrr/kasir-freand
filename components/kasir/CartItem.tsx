'use client'
import type { CartItem as CartItemType } from '@/lib/types'
import { useCartStore } from '@/lib/store/cartStore'
import { formatRupiah } from '@/lib/utils'
import { useState } from 'react'

interface CartItemProps {
  item: CartItemType
}

export default function CartItemComponent({ item }: CartItemProps) {
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const setItemDiscount = useCartStore((s) => s.setItemDiscount)
  const [showDiscount, setShowDiscount] = useState(false)

  const subtotal = (item.price - item.itemDiscount) * item.qty

  return (
    <div className="glass-card p-3 mb-2">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-body-md font-semibold text-on-surface truncate">{item.name}</p>
          <p className="text-label text-on-surface-variant">{formatRupiah(item.price)} / item</p>
          {item.itemDiscount > 0 && (
            <p className="text-label text-secondary">Diskon: -{formatRupiah(item.itemDiscount)}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-body-md font-bold gradient-text">{formatRupiah(subtotal)}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQty(item.productId, -1, item.variantId)}
              className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-error-container/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="text-body-md font-bold text-on-surface w-6 text-center">{item.qty}</span>
            <button
              onClick={() => updateQty(item.productId, 1, item.variantId)}
              className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setShowDiscount(!showDiscount)}
          className="text-label text-primary bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20"
        >
          {showDiscount ? 'Tutup' : 'Diskon'}
        </button>
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          className="text-label text-error bg-error-container/20 px-2 py-1 rounded-lg hover:bg-error-container/40"
        >
          Hapus
        </button>
      </div>
      {showDiscount && (
        <div className="mt-2">
          <input
            type="number"
            placeholder="Nominal diskon"
            value={item.itemDiscount || ''}
            onChange={(e) => setItemDiscount(item.productId, Number(e.target.value), item.variantId)}
            className="w-full bg-surface-container rounded-xl px-3 py-2 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}
