'use client'
import { useState, useMemo } from 'react'
import { useProductStore } from '@/lib/store/productStore'
import ProductCard from './ProductCard'
import BundleCard from './BundleCard'
import { useSettingStore } from '@/lib/store/settingStore' // ENHANCEMENT: 5
import Input from '@/components/ui/Input'

export default function ProductGrid() {
  const products = useProductStore((s) => s.products)
  const bundles = useProductStore((s) => s.bundles)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')

  const allCategories = ['Semua', ...CATEGORIES]

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.isActive) return false
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'Semua' || p.category === category
      return matchSearch && matchCat
    })
  }, [products, search, category])

  const filteredBundles = useMemo(() => {
    return bundles.filter((b) => b.isActive && b.name.toLowerCase().includes(search.toLowerCase()))
  }, [bundles, search])

  return (
    <div className="px-4">
      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon="search"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-label font-medium transition-all ${
              category === cat ? 'active-category' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bundles */}
      {filteredBundles.length > 0 && category === 'Semua' && (
        <div className="mb-4">
          <p className="text-label text-on-surface-variant mb-2 font-medium uppercase tracking-wide">Paket Bundle</p>
          <div className="flex flex-col gap-2">
            {filteredBundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
          </div>
        </div>
      )}

      {/* Products grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-3">inventory_2</span>
          <p className="text-headline text-on-surface">Produk tidak ditemukan</p>
          <p className="text-body-md text-on-surface-variant">Coba kata kunci lain</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Bottom padding for CartBar + BottomNav */}
      <div className="h-32" />
    </div>
  )
}
