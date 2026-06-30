'use client'
import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { useCartStore } from '@/lib/store/cartStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useTxStore } from '@/lib/store/txStore'
import { useProductStore } from '@/lib/store/productStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useSettingStore } from '@/lib/store/settingStore'
import { formatRupiah, hitungPoin, hitungRedeemValue } from '@/lib/utils'
import type { PaymentMethod, Transaction } from '@/lib/types'
import { toast } from 'sonner'

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (tx: Transaction) => void
}

export default function CheckoutModal({ open, onClose, onSuccess }: CheckoutModalProps) {
  const { items, globalDiscount, discountType, customerId, poinRedeem, setCustomer, setPoinRedeem, clearCart } = useCartStore()
  const subtotal = useCartStore((s) => s.subtotal())
  const ppnAmount = useCartStore((s) => s.ppnAmount())
  const discountAmount = useCartStore((s) => s.discountAmount())
  const total = useCartStore((s) => s.total())

  const customers = useCustomerStore((s) => s.customers)
  const addPoin = useCustomerStore((s) => s.addPoin)
  const redeemPoin = useCustomerStore((s) => s.redeemPoin)
  const updateCustomer = useCustomerStore((s) => s.updateCustomer)

  const addTransaction = useTxStore((s) => s.addTransaction)
  const decrementStock = useProductStore((s) => s.decrementStock)
  const bundles = useProductStore((s) => s.bundles)
  const currentUser = useAuthStore((s) => s.currentUser)
  const currentShift = useAuthStore((s) => s.currentShift)
  const settings = useSettingStore()

  const [metode, setMetode] = useState<PaymentMethod>('tunai')
  const [bayar, setBayar] = useState('')
  const [txNote, setTxNote] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerList, setShowCustomerList] = useState(false)

  useEffect(() => {
    if (open) {
      setMetode('tunai')
      setBayar('')
      setTxNote('')
      setCustomerSearch('')
      setShowCustomerList(false)
    }
  }, [open])

  const selectedCustomer = customers.find((c) => c.id === customerId)
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  )

  const bayarNum = metode === 'tunai' ? (Number(bayar) || 0) : total
  const kembalian = metode === 'tunai' ? Math.max(0, bayarNum - total) : 0
  const poinDapat = hitungPoin(total, settings.loyalty.rpPerPoin)
  const poinRedeemValue = hitungRedeemValue(poinRedeem, settings.loyalty.poinPerRp)

  const handleConfirm = () => {
    if (!currentUser || !currentShift) { toast.error('Tidak ada sesi aktif'); return }
    if (metode === 'tunai' && bayarNum < total) { toast.error('Uang tidak cukup'); return }

    const txItems = items.map((i) => {
      const ppnAmt = i.ppnRate > 0 && settings.ppn.enabled
        ? (settings.ppn.mode === 'exclusive'
          ? (i.price - i.itemDiscount) * i.qty * (i.ppnRate / 100)
          : (i.price - i.itemDiscount) * i.qty * (i.ppnRate / (100 + i.ppnRate)))
        : 0
      return {
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        emoji: i.emoji, // FIXED: BUG 8
        ppnRate: i.ppnRate,
        ppnAmount: ppnAmt,
        itemDiscount: i.itemDiscount,
        subtotal: (i.price - i.itemDiscount) * i.qty + ppnAmt,
        note: i.note,
      }
    })

    const tx = addTransaction({
      kasirId: currentUser.id,
      kasirName: currentUser.name,
      shiftId: currentShift.id,
      customerId: customerId ?? undefined,
      items: txItems,
      subtotal,
      ppnAmount,
      discount: globalDiscount,
      discountType,
      total,
      metode,
      bayar: bayarNum,
      kembalian,
      poinDidapat: poinDapat,
      poinDipakai: poinRedeem,
      note: txNote,
      isVoid: false,
    })

    // FIXED: BUG 4 — bundle decrement iterates component products, not bundle ID
    items.forEach((i) => {
      if (i.productId.startsWith('bundle-')) {
        const bundleId = i.productId.replace('bundle-', '')
        const bundle = bundles.find((b) => b.id === bundleId)
        if (bundle) {
          bundle.items.forEach((bi) => decrementStock(bi.productId, bi.qty * i.qty))
        }
      } else {
        decrementStock(i.productId, i.qty)
      }
    })

    // Loyalty
    if (selectedCustomer) {
      addPoin(selectedCustomer.id, poinDapat)
      if (poinRedeem > 0) redeemPoin(selectedCustomer.id, poinRedeem)
      updateCustomer(selectedCustomer.id, {
        totalBelanja: selectedCustomer.totalBelanja + total,
        totalTransaksi: selectedCustomer.totalTransaksi + 1,
      })
    }

    clearCart()
    toast.success('Transaksi berhasil!')
    onSuccess(tx)
  }

  return (
    <Modal open={open} onClose={onClose} title="Checkout" maxHeight="90vh">
      <div className="px-4 pb-6 flex flex-col gap-4">
        {/* Item summary */}
        <div className="glass-card p-3">
          {items.slice(0, 3).map((i, idx) => (
            <div key={idx} className="flex justify-between text-body-md text-on-surface-variant mb-1">
              <span>{i.name} ×{i.qty}</span>
              <span>{formatRupiah((i.price - i.itemDiscount) * i.qty)}</span>
            </div>
          ))}
          {items.length > 3 && <p className="text-label text-outline">+{items.length - 3} item lainnya</p>}
          {ppnAmount > 0 && (
            <div className="flex justify-between text-label text-on-surface-variant border-t border-outline-variant/30 mt-2 pt-2">
              <span>PPN {settings.ppn.rate}%</span>
              <span>{formatRupiah(ppnAmount)}</span>
            </div>
          )}
          {discountAmount > 0 && (
            <div className="flex justify-between text-label text-secondary">
              <span>Diskon</span>
              <span>-{formatRupiah(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-body-md font-bold text-on-surface border-t border-outline-variant/30 mt-2 pt-2">
            <span>Total</span>
            <span className="gradient-text">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Customer */}
        <div>
          <p className="text-label text-on-surface-variant mb-2">Pelanggan (opsional)</p>
          {selectedCustomer ? (
            <div className="glass-card p-3 flex items-center justify-between">
              <div>
                <p className="text-body-md font-semibold text-on-surface">{selectedCustomer.name}</p>
                <p className="text-label text-secondary">{selectedCustomer.poin} poin</p>
              </div>
              <button onClick={() => setCustomer(null)} className="text-outline hover:text-error">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                placeholder="Cari pelanggan..."
                value={customerSearch}
                onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerList(true) }}
                onFocus={() => setShowCustomerList(true)}
                className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
              />
              {showCustomerList && customerSearch && filteredCustomers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high rounded-xl border border-outline-variant/50 z-10 max-h-40 overflow-y-auto">
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setCustomer(c.id); setCustomerSearch(''); setShowCustomerList(false) }}
                      className="w-full px-4 py-2.5 text-left hover:bg-surface-container-highest flex items-center justify-between"
                    >
                      <span className="text-body-md text-on-surface">{c.name}</span>
                      <span className="text-label text-secondary">{c.poin} poin</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Poin redeem */}
        {selectedCustomer && settings.loyalty.enabled && selectedCustomer.poin >= settings.loyalty.minRedeem && (
          <div className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-body-md text-on-surface">Redeem Poin</p>
              <span className="text-label text-secondary">{selectedCustomer.poin} poin tersedia</span>
            </div>
            <input
              type="number"
              placeholder={`Min ${settings.loyalty.minRedeem} poin`}
              value={poinRedeem || ''}
              onChange={(e) => setPoinRedeem(Math.min(Number(e.target.value), selectedCustomer.poin))}
              className="w-full bg-surface-container rounded-xl px-3 py-2 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
            />
            {poinRedeem > 0 && (
              <p className="text-label text-secondary mt-1">Nilai: {formatRupiah(poinRedeemValue)}</p>
            )}
          </div>
        )}

        {/* Payment method */}
        <div>
          <p className="text-label text-on-surface-variant mb-2">Metode Bayar</p>
          <div className="grid grid-cols-3 gap-2">
            {(['tunai', 'qris', 'transfer'] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetode(m)}
                className={`py-3 rounded-xl text-body-md font-semibold transition-all capitalize ${
                  metode === m ? 'gradient-btn text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {m === 'tunai' ? '💵 Tunai' : m === 'qris' ? '📱 QRIS' : '🏦 Transfer'}
              </button>
            ))}
          </div>
        </div>

        {/* Cash input */}
        {metode === 'tunai' && (
          <div className="glass-card p-3">
            <input
              type="number"
              placeholder="Uang diterima"
              value={bayar}
              onChange={(e) => setBayar(e.target.value)}
              className="w-full bg-surface-container rounded-xl px-3 py-2 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none mb-2"
            />
            {bayarNum >= total && (
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">Kembalian</span>
                <span className="text-secondary font-bold">{formatRupiah(kembalian)}</span>
              </div>
            )}
            {/* Quick amounts */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {[total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000, 100000].filter((v, i, a) => a.indexOf(v) === i).map((amt) => (
                <button key={amt} onClick={() => setBayar(String(amt))} className="text-label bg-primary/10 text-primary px-2 py-1 rounded-lg">
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        <input
          placeholder="Catatan (opsional)"
          value={txNote}
          onChange={(e) => setTxNote(e.target.value)}
          className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-secondary focus:outline-none"
        />

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl font-bold text-body-lg text-on-primary active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #41eec2, #0be298)' }}
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </Modal>
  )
}
