'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useProductStore } from '@/lib/store/productStore'
import BottomNav from '@/components/layout/BottomNav'
import ProductList from '@/components/produk/ProductList'
import StokOpname from '@/components/produk/StokOpname'
import ProductForm from '@/components/produk/ProductForm'

type Tab = 'produk' | 'bundle' | 'opname'

export default function ProdukPage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const products = useProductStore((s) => s.products)
  const lowStock = useMemo(() => products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold && p.isActive), [products])
  const [tab, setTab] = useState<Tab>('produk')
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  const activeCount = products.filter((p) => p.isActive).length

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between">
          <span className="font-display text-title gradient-text">Produk</span>
          <button onClick={() => setAddOpen(true)} className="gradient-btn text-on-primary w-9 h-9 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>

      <div className="px-4">
        {/* Stats */}
        <div className="glass-card p-4 mb-4">
          <div className="flex gap-4">
            <div className="flex-1 text-center">
              <p className="text-numeral-lg gradient-text font-bold">{activeCount}</p>
              <p className="text-label text-on-surface-variant">Produk Aktif</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-numeral-lg text-tertiary font-bold">{lowStock.length}</p>
              <p className="text-label text-on-surface-variant">Stok Rendah</p>
            </div>
          </div>
        </div>

        {/* Low stock alert */}
        {lowStock.length > 0 && (
          <div className="glass-card p-3 mb-4 border-error/30 bg-error-container/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-error text-[20px]">warning</span>
              <span className="text-body-md text-error font-semibold">Stok hampir habis</span>
            </div>
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-label text-on-surface-variant">
                <span>{p.emoji}</span>
                <span>{p.name}</span>
                <span className="text-error font-bold ml-auto">{p.stock} tersisa</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-container rounded-xl p-1 mb-4">
          {(['produk', 'opname'] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-label font-medium capitalize transition-all ${
                tab === t ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
              }`}
            >
              {t === 'opname' ? 'Stok Opname' : 'Produk'}
            </button>
          ))}
        </div>

        {tab === 'produk' && <ProductList />}
        {tab === 'opname' && <StokOpname />}
      </div>

      <ProductForm open={addOpen} onClose={() => setAddOpen(false)} />
      <BottomNav />
    </div>
  )
}
