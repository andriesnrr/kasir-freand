'use client'
import { useState } from 'react'
import { useProductStore } from '@/lib/store/productStore'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'

export default function StokOpname() {
  const products = useProductStore((s) => s.products.filter((p) => p.isActive))
  const updateStockBulk = useProductStore((s) => s.updateStockBulk)
  const [stocks, setStocks] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((p) => [p.id, p.stock]))
  )

  const handleSave = () => {
    const updates = products.map((p) => ({ id: p.id, stock: stocks[p.id] ?? p.stock }))
    updateStockBulk(updates)
    toast.success('Stok diperbarui')
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        {products.map((p) => (
          <div key={p.id} className="glass-card p-3 flex items-center gap-3">
            <span className="text-2xl">{p.emoji}</span>
            <div className="flex-1">
              <p className="text-body-md text-on-surface">{p.name}</p>
              <p className="text-label text-on-surface-variant">Stok saat ini: {p.stock}</p>
            </div>
            <input
              type="number"
              value={stocks[p.id] ?? p.stock}
              onChange={(e) => setStocks((s) => ({ ...s, [p.id]: Number(e.target.value) }))}
              className="w-20 bg-surface-container rounded-xl px-3 py-2 text-body-md text-on-surface text-center border border-outline-variant/50 focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>
      <Button className="w-full" onClick={handleSave}>Simpan Stok Opname</Button>
    </div>
  )
}
