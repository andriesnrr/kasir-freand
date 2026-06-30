'use client'
import type { Transaction } from '@/lib/types'
import { useSettingStore } from '@/lib/store/settingStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { formatRupiah, formatTanggal } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface ReceiptViewProps {
  tx: Transaction
  onNew: () => void
}

export default function ReceiptView({ tx, onNew }: ReceiptViewProps) {
  const settings = useSettingStore()
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 2000)
    return () => clearTimeout(t)
  }, [])

  const strukcText = `${settings.toko.nama}
${settings.toko.alamat}
${formatTanggal(tx.createdAt)}
ID: ${tx.id}
Kasir: ${tx.kasirName}

${tx.items.map((i) => `${i.name} x${i.qty} = ${formatRupiah(i.subtotal)}`).join('\n')}

Subtotal: ${formatRupiah(tx.subtotal)}
${tx.ppnAmount > 0 ? `PPN: ${formatRupiah(tx.ppnAmount)}\n` : ''}${tx.discount > 0 ? `Diskon: -${formatRupiah(tx.discount)}\n` : ''}Total: ${formatRupiah(tx.total)}
Bayar: ${formatRupiah(tx.bayar)}
Kembalian: ${formatRupiah(tx.kembalian)}

${settings.struk.footer}`

  const handleWhatsApp = () => {
    window.open('https://wa.me/?text=' + encodeURIComponent(strukcText))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-background flex flex-col overflow-hidden">
      {/* Confetti */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                background: i % 2 === 0 ? '#c4c0ff' : '#41eec2',
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[40px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 className="font-display text-display-sm text-on-surface">Transaksi Berhasil!</h2>
        <p className="text-body-md text-on-surface-variant mt-1">{tx.id}</p>
      </div>

      {/* Receipt */}
      <div id="struk-print" className="flex-1 overflow-y-auto px-4">
        <div className="glass-card p-5 font-mono text-body-md">
          <div className="text-center mb-4">
            <p className="font-bold text-on-surface text-title">{settings.toko.nama}</p>
            <p className="text-on-surface-variant text-label">{settings.toko.alamat}</p>
            <p className="text-on-surface-variant text-label">{formatTanggal(tx.createdAt)}</p>
          </div>
          <div className="border-t border-dashed border-outline-variant mb-3" />
          {tx.items.map((item, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between text-on-surface">
                <span className="flex-1 truncate">{item.name}</span>
                <span className="ml-2">{formatRupiah(item.price)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant text-label">
                <span>×{item.qty}</span>
                <span>{formatRupiah(item.subtotal)}</span>
              </div>
            </div>
          ))}
          <div className="border-t border-dashed border-outline-variant my-3" />
          <div className="flex justify-between text-on-surface-variant text-label mb-1">
            <span>Subtotal</span><span>{formatRupiah(tx.subtotal)}</span>
          </div>
          {tx.ppnAmount > 0 && (
            <div className="flex justify-between text-on-surface-variant text-label mb-1">
              <span>PPN</span><span>{formatRupiah(tx.ppnAmount)}</span>
            </div>
          )}
          {tx.discount > 0 && (
            <div className="flex justify-between text-secondary text-label mb-1">
              <span>Diskon</span><span>-{formatRupiah(tx.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-on-surface text-body-lg">
            <span>Total</span><span className="gradient-text">{formatRupiah(tx.total)}</span>
          </div>
          <div className="border-t border-dashed border-outline-variant my-3" />
          <div className="flex justify-between text-on-surface-variant text-label mb-1">
            <span>Bayar ({tx.metode})</span><span>{formatRupiah(tx.bayar)}</span>
          </div>
          {tx.kembalian > 0 && (
            <div className="flex justify-between text-secondary font-bold text-body-md">
              <span>Kembalian</span><span>{formatRupiah(tx.kembalian)}</span>
            </div>
          )}
          {tx.poinDidapat > 0 && (
            <div className="flex justify-between text-primary text-label mt-2">
              <span>Poin didapat</span><span>+{tx.poinDidapat}</span>
            </div>
          )}
          <div className="border-t border-dashed border-outline-variant mt-3 pt-3 text-center">
            <p className="text-on-surface-variant text-label">{settings.struk.footer}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-8 pt-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex-1 py-3 rounded-2xl border border-outline-variant/50 text-body-md text-on-surface-variant flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">print</span> Print
          </button>
          <button onClick={handleWhatsApp} className="flex-1 py-3 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary text-body-md flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">share</span> WhatsApp
          </button>
        </div>
        <button onClick={onNew} className="w-full py-4 rounded-2xl gradient-btn text-on-primary font-bold text-body-lg active:scale-95 transition-all">
          Transaksi Baru
        </button>
      </div>
    </div>
  )
}
