'use client'
import { useState } from 'react'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store/cartStore'
import { formatRupiah } from '@/lib/utils'
import Modal from '@/components/ui/Modal'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const [variantModal, setVariantModal] = useState(false)

  const inCart = items.some((i) => i.productId === product.id)
  const cartQty = items.filter((i) => i.productId === product.id).reduce((s, i) => s + i.qty, 0)
  const outOfStock = product.stock === 0

  const handleTap = () => {
    if (outOfStock) return
    if (product.variants.length > 0) { setVariantModal(true); return }
    addItem(product)
  }

  return (
    <>
      <button
        onClick={handleTap}
        disabled={outOfStock}
        className={`glass-card p-3 text-left relative transition-all active:scale-95 w-full ${
          inCart ? 'border-primary/60 shadow-[0_0_12px_rgba(196,192,255,0.2)]' : ''
        } ${outOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20'}`}
      >
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl z-10">
            <span className="text-label text-error font-semibold bg-error-container/80 px-2 py-1 rounded-lg">Habis</span>
          </div>
        )}

        {cartQty > 0 && (
          <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold flex items-center justify-center">
            {cartQty}
          </div>
        )}

        <div className="text-3xl mb-2">{product.emoji}</div>
        <p className="text-body-md font-semibold text-on-surface line-clamp-2 mb-1">{product.name}</p>
        <p className="text-label gradient-text font-bold">{formatRupiah(product.price)}</p>

        <div className="flex gap-1 mt-2 flex-wrap">
          {product.ppn !== 'none' && (
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">PPN</span>
          )}
          {product.stock <= product.lowStockThreshold && product.stock > 0 && (
            <span className="text-[10px] bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded-full">Stok {product.stock}</span>
          )}
          {product.variants.length > 0 && (
            <span className="text-[10px] bg-outline-variant/30 text-on-surface-variant px-1.5 py-0.5 rounded-full">{product.variants.length} varian</span>
          )}
        </div>
      </button>

      <Modal open={variantModal} onClose={() => setVariantModal(false)} title={`Pilih Varian — ${product.name}`}>
        <div className="px-5 pb-6 flex flex-col gap-3">
          {product.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => { addItem(product, v.id); setVariantModal(false) }}
              className="flex items-center justify-between p-4 glass-card hover:border-primary/40 transition-all"
            >
              <span className="text-body-md text-on-surface">{v.name}</span>
              <span className="gradient-text font-bold text-body-md">{formatRupiah(v.priceOverride)}</span>
            </button>
          ))}
        </div>
      </Modal>
    </>
  )
}
