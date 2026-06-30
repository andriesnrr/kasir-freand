'use client'
import { useState } from 'react'
import { useProductStore } from '@/lib/store/productStore'
import ProductForm from './ProductForm'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function ProductList() {
  const products = useProductStore((s) => s.products)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  const getStockVariant = (p: Product) => {
    if (p.stock === 0) return 'text-error bg-error-container/30'
    if (p.stock <= p.lowStockThreshold) return 'text-tertiary bg-tertiary/10'
    return 'text-secondary bg-secondary/10'
  }

  return (
    <>
      {products.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <span className="material-symbols-outlined text-[48px] text-outline mb-3">inventory_2</span>
          <p className="text-headline text-on-surface">Belum ada produk</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <button key={p.id} onClick={() => setEditProduct(p)} className="glass-card p-4 text-left flex items-center gap-3 hover:border-white/20 transition-all">
              <span className="text-3xl">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-body-md font-semibold text-on-surface truncate">{p.name}</p>
                <p className="text-label gradient-text font-bold">{formatRupiah(p.price)}</p>
                <div className="flex gap-1 mt-1">
                  {p.ppn !== 'none' && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">PPN</span>}
                  {p.variants.length > 0 && <span className="text-[10px] bg-outline-variant/30 text-on-surface-variant px-1.5 py-0.5 rounded-full">{p.variants.length} varian</span>}
                  {!p.isActive && <span className="text-[10px] bg-error-container/30 text-error px-1.5 py-0.5 rounded-full">Nonaktif</span>}
                </div>
              </div>
              <span className={`text-label px-2 py-1 rounded-xl font-bold ${getStockVariant(p)}`}>
                {p.stock} {p.satuan}
              </span>
            </button>
          ))}
        </div>
      )}

      {editProduct && (
        <ProductForm open={true} onClose={() => setEditProduct(null)} product={editProduct} />
      )}
    </>
  )
}
