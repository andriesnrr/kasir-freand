'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useSettingStore } from '@/lib/store/settingStore'
import BottomNav from '@/components/layout/BottomNav'
import CustomerForm from '@/components/pelanggan/CustomerForm'
import { formatRupiah, getInitials } from '@/lib/utils'
import type { Customer } from '@/lib/types'

export default function PelangganPage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const customers = useCustomerStore((s) => s.customers)
  const loyalty = useSettingStore((s) => s.loyalty)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null)

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
              <button key={c.id} onClick={() => setEditCustomer(c)} className="glass-card p-4 flex items-center gap-3 text-left hover:border-white/20 transition-all">
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
      <BottomNav />
    </div>
  )
}
