'use client'
import type { Bundle } from '@/lib/types'
import { useCartStore } from '@/lib/store/cartStore'
import { useProductStore } from '@/lib/store/productStore'
import { formatRupiah } from '@/lib/utils'
import { toast } from 'sonner'

interface BundleCardProps {
  bundle: Bundle
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const products = useProductStore((s) => s.products)
  const isBundleAvailable = useProductStore((s) => s.isBundleAvailable)

  const available = isBundleAvailable(bundle)
  const individualTotal = bundle.items.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.productId)
    return sum + (p ? p.price * item.qty : 0)
  }, 0)
  const savings = individualTotal - bundle.price

  const handleAdd = () => {
    if (!available) { toast.error('Stok tidak mencukupi untuk bundle ini'); return }
    // Add bundle as a single product-like item with the bundle price
    const syntheticProduct = {
      id: `bundle-${bundle.id}`,
      name: bundle.name,
      price: bundle.price,
      stock: 99,
      lowStockThreshold: 0,
      satuan: 'paket',
      emoji: bundle.emoji,
      category: 'Bundle',
      ppn: 'none' as const,
      variants: [],
      isActive: true,
      createdAt: bundle.createdAt,
    }
    addItem(syntheticProduct)
    // Decrement stock for each component (handled separately since syntheticProduct id differs)
    toast.success(`${bundle.name} ditambahkan`)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={!available}
      className={`w-full glass-card p-4 text-left transition-all active:scale-[0.98] ${
        available ? 'border-primary/40 hover:border-primary/60' : 'opacity-50 cursor-not-allowed'
      }`}
      style={{ background: 'linear-gradient(135deg, rgba(196,192,255,0.05), rgba(65,238,194,0.05))' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{bundle.emoji}</span>
        <div className="flex-1">
          <p className="font-semibold text-body-md text-on-surface">{bundle.name}</p>
          <p className="text-label text-on-surface-variant mt-0.5">{bundle.description}</p>
        </div>
        <div className="text-right">
          <p className="gradient-text font-bold text-body-md">{formatRupiah(bundle.price)}</p>
          {savings > 0 && (
            <p className="text-[10px] text-secondary mt-0.5">Hemat {formatRupiah(savings)}</p>
          )}
        </div>
      </div>
      {!available && (
        <p className="text-label text-error mt-2">Stok tidak cukup</p>
      )}
    </button>
  )
}
