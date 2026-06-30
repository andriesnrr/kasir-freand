'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useSettingStore } from '@/lib/store/settingStore'
import { useTxStore } from '@/lib/store/txStore'
import BottomNav from '@/components/layout/BottomNav'
import CustomerForm from '@/components/pelanggan/CustomerForm'
import { formatRupiah, formatTanggal, getInitials } from '@/lib/utils'
import type { Customer } from '@/lib/types'

export default function PelangganPage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const customers = useCustomerStore((s) => s.customers)
  const loyalty = useSettingStore((s) => s.loyalty)
  const history = useTxStore((s) => s.history)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  const totalPoin = customers.reduce((s, c) => s + c.poin, 0)
  const totalBelanja = customers.reduce((s, c) => s + c.totalBelanja, 0)

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between">
          <span className="font-display text-title gradient-text">Pelanggan</span>
          <button onClick={() => setAddOpen(true)} className="gradient-btn text-on-primary w-9 h-9 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>

      <div className="px-4">
        {/* Loyalty summary */}
        {loyalty.enabled && (
          <div className="glass-card p-4 mb-4 border-primary/20">
            <p className="text-label text-on-surface-variant mb-2">Program Loyalty</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-numeral-lg gradient-text font-bold">{customers.length}</p>
                <p className="text-label text-on-surface-variant">Total Pelanggan</p>
              </div>
              <div className="flex-1">
                <p className="text-numeral-lg text-primary font-bold">{totalPoin.toLocaleString('id-ID')}</p>
                <p className="text-label text-on-surface-variant">Total Poin</p>
              </div>
              <div className="flex-1">
                <p className="text-numeral-lg text-secondary font-bold">{formatRupiah(totalBelanja)}</p>
                <p className="text-label text-on-surface-variant">Total Belanja</p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            placeholder="Cari pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-high rounded-xl pl-10 pr-4 py-3 text-body-md text-on-surface border border-outline-variant/50 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Customer list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <span className="material-symbols-outlined text-[48px] text-outline mb-3">people</span>
            <p className="text-headline text-on-surface">Belum ada pelanggan</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => setDetailCustomer(c)} className="glass-card p-4 flex items-center gap-3 text-left hover:border-white/20 transition-all">
                <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center text-on-primary font-bold text-body-md flex-shrink-0">
                  {getInitials(c.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-semibold text-on-surface truncate">{c.name}</p>
                  <p className="text-label text-on-surface-variant">{c.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-label text-primary font-bold">{c.poin} poin</p>
                  <p className="text-[10px] text-on-surface-variant">{formatRupiah(c.totalBelanja)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CustomerForm open={addOpen} onClose={() => setAddOpen(false)} />
      {editCustomer && <CustomerForm open={true} onClose={() => setEditCustomer(null)} customer={editCustomer} />}

      {/* Customer Detail overlay */}
      {detailCustomer && (() => {
        const txs = history.filter((t) => t.customerId === detailCustomer.id && !t.isVoid)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        return (
          <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0F0F13' }}>
            <div className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3" style={{ background: 'rgba(15,15,19,0.95)', backdropFilter: 'blur(12px)' }}>
              <button onClick={() => setDetailCustomer(null)} className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
              </button>
              <span className="font-display text-title gradient-text">Detail Pelanggan</span>
              <button onClick={() => { setEditCustomer(detailCustomer); setDetailCustomer(null) }}
                className="ml-auto text-primary text-body-md">Edit</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8">
              {/* Avatar + nama */}
              <div className="flex flex-col items-center py-6">
                <div className="w-20 h-20 rounded-full gradient-btn flex items-center justify-center text-on-primary font-bold text-display-sm mb-3">
                  {getInitials(detailCustomer.name)}
                </div>
                <h2 className="text-headline font-bold text-on-surface">{detailCustomer.name}</h2>
                <p className="text-body-md text-on-surface-variant">{detailCustomer.phone}</p>
                {detailCustomer.email && <p className="text-label text-on-surface-variant">{detailCustomer.email}</p>}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass-card p-3 text-center">
                  <p className="text-numeral-lg text-primary font-bold">{detailCustomer.totalTransaksi}</p>
                  <p className="text-label text-on-surface-variant">Transaksi</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-body-md gradient-text font-bold">{formatRupiah(detailCustomer.totalBelanja)}</p>
                  <p className="text-label text-on-surface-variant">Total Belanja</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-numeral-lg text-secondary font-bold">{detailCustomer.poin}</p>
                  <p className="text-label text-on-surface-variant">Poin</p>
                </div>
              </div>

              {/* Poin card */}
              {loyalty.enabled && (
                <div className="glass-card p-4 mb-4 border-secondary/20">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-body-md font-semibold text-on-surface">Program Loyalty</p>
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  </div>
                  <p className="text-numeral-lg text-secondary font-bold">{detailCustomer.poin} poin</p>
                  <p className="text-label text-on-surface-variant">≈ {formatRupiah(detailCustomer.poin * loyalty.poinPerRp)}</p>
                </div>
              )}

              {/* Riwayat transaksi */}
              <p className="text-body-md font-semibold text-on-surface mb-3">Riwayat Transaksi</p>
              {txs.length === 0 ? (
                <div className="glass-card p-6 text-center">
                  <p className="text-on-surface-variant text-body-md">Belum ada transaksi</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {txs.map((t) => (
                    <div key={t.id} className="glass-card p-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-label text-on-surface-variant">{t.id}</span>
                        <span className="text-label text-on-surface-variant">{formatTanggal(t.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-md text-on-surface">{t.items.length} item · {t.metode}</span>
                        <span className="text-body-md gradient-text font-bold">{formatRupiah(t.total)}</span>
                      </div>
                      {t.poinDidapat > 0 && (
                        <p className="text-label text-primary mt-1">+{t.poinDidapat} poin</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })()}

      <BottomNav />
    </div>
  )
}
