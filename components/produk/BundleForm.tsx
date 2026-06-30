'use client'
import { useState, useRef, useMemo } from 'react'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useProductStore } from '@/lib/store/productStore'
import { EMOJI_LIST } from '@/lib/constants'
import { formatRupiah } from '@/lib/utils'
import type { Bundle, BundleItem } from '@/lib/types'
import { toast } from 'sonner'

interface BundleFormProps {
  open: boolean
  onClose: () => void
  bundle?: Bundle
}

export default function BundleForm({ open, onClose, bundle }: BundleFormProps) {
  const allProducts = useProductStore((s) => s.products)
  const products = useMemo(() => allProducts.filter((p) => p.isActive), [allProducts])
  const { addBundle, updateBundle, deleteBundle } = useProductStore()

  const [emoji, setEmoji] = useState(bundle?.emoji ?? '🎁')
  const [isActive, setIsActive] = useState(bundle?.isActive ?? true)
  const [items, setItems] = useState<BundleItem[]>(bundle?.items ?? [])
  const [productSearch, setProductSearch] = useState('')
  const [showProductList, setShowProductList] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const descRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      !items.find((i) => i.productId === p.id)
  )

  const addItem = (productId: string) => {
    setItems((prev) => [...prev, { productId, qty: 1 }])
    setProductSearch('')
    setShowProductList(false)
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeItem(productId); return }
    setItems((prev) => prev.map((i) => i.productId === productId ? { ...i, qty } : i))
  }

  const normalPrice = items.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.productId)
    return sum + (p?.price ?? 0) * item.qty
  }, 0)
  const bundlePrice = Number(priceRef.current?.value ?? bundle?.price ?? 0)
  const savings = normalPrice - bundlePrice

  const handleSave = () => {
    const name = nameRef.current?.value ?? ''
    const price = Number(priceRef.current?.value ?? 0)
    if (!name) { toast.error('Nama wajib diisi'); return }
    if (items.length < 2) { toast.error('Bundle harus minimal 2 produk'); return }
    if (price <= 0) { toast.error('Harga bundle wajib diisi'); return }

    const data = {
      name,
      description: descRef.current?.value ?? '',
      emoji,
      items,
      price,
      isActive,
    }
    if (bundle) {
      updateBundle(bundle.id, data)
      toast.success('Bundle diperbarui')
    } else {
      addBundle(data)
      toast.success('Bundle ditambahkan')
    }
    onClose()
  }

  const handleDelete = () => {
    if (!bundle) return
    deleteBundle(bundle.id)
    toast.success('Bundle dihapus')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={bundle ? 'Edit Bundle' : 'Tambah Bundle'} maxHeight="90vh">
      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Emoji picker */}
        <div>
          <p className="text-label text-on-surface-variant mb-2">Emoji</p>
          <div className="grid grid-cols-10 gap-1">
            {EMOJI_LIST.map((e) => (
              <button type="button" key={e} onClick={() => setEmoji(e)}
                className={`text-xl p-1 rounded-lg ${emoji === e ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-surface-container-high'}`}
              >{e}</button>
            ))}
          </div>
        </div>

        <Input ref={nameRef} label="Nama Bundle" defaultValue={bundle?.name} placeholder="Paket Makan Siang" />
        <Input ref={descRef} label="Deskripsi" defaultValue={bundle?.description} placeholder="Nasi Goreng + Es Teh" />

        {/* Product items */}
        <div>
          <p className="text-label text-on-surface-variant mb-2">Produk dalam Bundle</p>
          {items.length > 0 && (
            <div className="flex flex-col gap-2 mb-3">
              {items.map((item) => {
                const p = products.find((x) => x.id === item.productId)
                if (!p) return null
                return (
                  <div key={item.productId} className="glass-card px-3 py-2 flex items-center gap-3">
                    <span className="text-xl">{p.emoji}</span>
                    <div className="flex-1">
                      <p className="text-body-md text-on-surface">{p.name}</p>
                      <p className="text-label text-on-surface-variant">{formatRupiah(p.price)} / {p.satuan}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="text-body-md text-on-surface w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.productId)} className="text-error ml-1">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add product */}
          <div className="relative">
            <input
              placeholder="Cari & tambah produk..."
              value={productSearch}
              onChange={(e) => { setProductSearch(e.target.value); setShowProductList(true) }}
              onFocus={() => setShowProductList(true)}
              className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
            />
            {showProductList && productSearch && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high rounded-xl border border-outline-variant/50 z-10 max-h-40 overflow-y-auto">
                {filteredProducts.map((p) => (
                  <button key={p.id} onClick={() => addItem(p.id)}
                    className="w-full px-4 py-2.5 text-left hover:bg-surface-container-highest flex items-center gap-3">
                    <span>{p.emoji}</span>
                    <span className="text-body-md text-on-surface">{p.name}</span>
                    <span className="text-label text-on-surface-variant ml-auto">{formatRupiah(p.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Input ref={priceRef} label="Harga Bundle" type="number" defaultValue={bundle?.price} placeholder="0"
          onChange={() => {
            // force re-render to update savings preview
          }}
        />

        {/* Savings preview */}
        {normalPrice > 0 && (
          <div className="glass-card p-3 border-secondary/20">
            <div className="flex justify-between text-label text-on-surface-variant mb-1">
              <span>Harga normal</span>
              <span className="line-through">{formatRupiah(normalPrice)}</span>
            </div>
            <div className="flex justify-between text-body-md font-semibold">
              <span className="text-on-surface">Hemat</span>
              <span className="text-secondary">{savings > 0 ? formatRupiah(savings) : '-'}</span>
            </div>
          </div>
        )}

        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <span className="text-body-md text-on-surface">Aktif</span>
          <button type="button" onClick={() => setIsActive(!isActive)}
            className={`w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-secondary' : 'bg-outline-variant'}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <Button onClick={handleSave} className="w-full">Simpan Bundle</Button>
        {bundle && <Button variant="danger" onClick={handleDelete} className="w-full">Hapus Bundle</Button>}
      </div>
    </Modal>
  )
}
