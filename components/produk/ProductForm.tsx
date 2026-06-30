'use client'
import { useState, useRef } from 'react'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useProductStore } from '@/lib/store/productStore'
import { useSettingStore } from '@/lib/store/settingStore'
import { EMOJI_LIST } from '@/lib/constants'
import type { Product } from '@/lib/types'
import { toast } from 'sonner'

interface ProductFormProps {
  open: boolean
  onClose: () => void
  product?: Product
}

export default function ProductForm({ open, onClose, product }: ProductFormProps) {
  const { addProduct, updateProduct, deleteProduct } = useProductStore()
  const categories = useSettingStore((s) => s.categories) // ENHANCEMENT: 5
  const [emoji, setEmoji] = useState(product?.emoji ?? '🍔')
  const [ppn, setPpn] = useState<string>(String(product?.ppn ?? 'none'))
  const [isActive, setIsActive] = useState(product?.isActive ?? true)

  const nameRef = useRef<HTMLInputElement>(null)
  const priceRef = useRef<HTMLInputElement>(null)
  const memberPriceRef = useRef<HTMLInputElement>(null) // ENHANCEMENT: 1
  const stockRef = useRef<HTMLInputElement>(null)
  const thresholdRef = useRef<HTMLInputElement>(null)
  const satuanRef = useRef<HTMLInputElement>(null)
  const barcodeRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLSelectElement>(null)

  const handleSave = () => {
    const name = nameRef.current?.value ?? ''
    if (!name) { toast.error('Nama wajib diisi'); return }
    const ppnValue: Product['ppn'] = ppn === 'none' ? 'none' : ppn === 'default' ? 'default' : Number(ppn)
    const data = {
      name,
      price: Number(priceRef.current?.value ?? 0),
      memberPrice: memberPriceRef.current?.value ? Number(memberPriceRef.current.value) : undefined, // ENHANCEMENT: 1
      stock: Number(stockRef.current?.value ?? 0),
      lowStockThreshold: Number(thresholdRef.current?.value ?? 5),
      satuan: satuanRef.current?.value ?? 'pcs',
      category: categoryRef.current?.value ?? 'Makanan',
      barcode: barcodeRef.current?.value || undefined,
      emoji, ppn: ppnValue, isActive,
    }
    if (product) {
      updateProduct(product.id, data)
      toast.success('Produk diperbarui')
    } else {
      addProduct({ ...data, image: undefined, variants: [] })
      toast.success('Produk ditambahkan')
    }
    onClose()
  }

  const handleDelete = () => {
    if (!product) return
    deleteProduct(product.id)
    toast.success('Produk dihapus')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Edit Produk' : 'Tambah Produk'} maxHeight="90vh">
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

        <Input ref={nameRef} label="Nama Produk" defaultValue={product?.name} placeholder="Nama produk" />
        <Input ref={priceRef} label="Harga" type="number" defaultValue={product?.price} placeholder="0" />
        {/* ENHANCEMENT: 1 — memberPrice field */}
        <Input ref={memberPriceRef} label="Harga Member (opsional)" type="number" defaultValue={product?.memberPrice ?? ''} placeholder="Kosongkan jika sama dengan harga normal" />
        <Input ref={stockRef} label="Stok" type="number" defaultValue={product?.stock} placeholder="0" />
        <Input ref={thresholdRef} label="Threshold Stok Rendah" type="number" defaultValue={product?.lowStockThreshold ?? 5} placeholder="5" />
        <Input ref={satuanRef} label="Satuan" defaultValue={product?.satuan ?? 'pcs'} placeholder="pcs / porsi / gelas" />
        <Input ref={barcodeRef} label="Barcode (opsional)" defaultValue={product?.barcode} placeholder="8991234..." />

        <div>
          <p className="text-label text-on-surface-variant mb-1">Kategori</p>
          <select ref={categoryRef} defaultValue={product?.category ?? 'Makanan'} className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <p className="text-label text-on-surface-variant mb-1">PPN</p>
          <div className="flex gap-2">
            {['none', 'default'].map((v) => (
              <button type="button" key={v} onClick={() => setPpn(v)}
                className={`px-3 py-2 rounded-xl text-label font-medium ${ppn === v ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}
              >{v === 'none' ? 'Tidak' : 'Default'}</button>
            ))}
            <input type="number" placeholder="Custom %" value={ppn !== 'none' && ppn !== 'default' ? ppn : ''} onChange={(e) => setPpn(e.target.value)}
              className="flex-1 bg-surface-container rounded-xl px-3 py-2 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-body-md text-on-surface">Aktif</span>
          <button type="button" onClick={() => setIsActive(!isActive)}
            className={`w-12 h-6 rounded-full transition-colors ${isActive ? 'bg-secondary' : 'bg-outline-variant'}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <Button onClick={handleSave} className="w-full">Simpan Produk</Button>
        {product && <Button variant="danger" onClick={handleDelete} className="w-full">Hapus Produk</Button>}
      </div>
    </Modal>
  )
}
