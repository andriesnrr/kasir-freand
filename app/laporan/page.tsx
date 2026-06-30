'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useTxStore } from '@/lib/store/txStore'
import { useProductStore } from '@/lib/store/productStore'
import BottomNav from '@/components/layout/BottomNav'
import { formatRupiah } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type Range = '7d' | '30d' | 'today'

export default function LaporanPage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const currentUser = useAuthStore((s) => s.currentUser)
  const history = useTxStore((s) => s.history)
  const products = useProductStore((s) => s.products)
  const [range, setRange] = useState<Range>('7d')
  const [kasirFilter, setKasirFilter] = useState('Semua') // ENHANCEMENT: 4

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  const { txs, days } = useMemo(() => {
    const now = new Date()
    const start = new Date()
    if (range === 'today') start.setHours(0, 0, 0, 0)
    else if (range === '7d') start.setDate(now.getDate() - 7)
    else start.setDate(now.getDate() - 30)

    const txs = history
      .filter((t) => !t.isVoid && new Date(t.createdAt) >= start)
      .filter((t) => kasirFilter === 'Semua' || t.kasirName === kasirFilter) // ENHANCEMENT: 4

    const dayMap: Record<string, number> = {}
    const daysCount = range === 'today' ? 1 : range === '7d' ? 7 : 30
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })
      dayMap[key] = 0
    }
    txs.forEach((t) => {
      const key = new Date(t.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })
      if (key in dayMap) dayMap[key] += t.total
    })
    const days = Object.entries(dayMap).map(([date, omzet]) => ({ date, omzet }))
    return { txs, days }
  }, [history, range])

  const omzet = txs.reduce((s, t) => s + t.total, 0)
  const transaksi = txs.length
  const avgBasket = transaksi > 0 ? omzet / transaksi : 0
  const itemTerjual = txs.reduce((s, t) => s + t.items.reduce((si, i) => si + i.qty, 0), 0)
  const ppnTotal = txs.reduce((s, t) => s + t.ppnAmount, 0)

  const productSales: Record<string, { name: string; emoji: string; qty: number }> = {}
  txs.forEach((t) => t.items.forEach((i) => {
    if (!productSales[i.productId]) {
      const p = products.find((x) => x.id === i.productId)
      productSales[i.productId] = { name: i.name, emoji: p?.emoji ?? '📦', qty: 0 }
    }
    productSales[i.productId].qty += i.qty
  }))
  const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5)
  const maxQty = topProducts[0]?.qty ?? 1

  const paymentBreakdown = { tunai: 0, qris: 0, transfer: 0 }
  txs.forEach((t) => { paymentBreakdown[t.metode] += t.total })
  const payTotal = paymentBreakdown.tunai + paymentBreakdown.qris + paymentBreakdown.transfer || 1

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)' }}>
        <span className="font-display text-title gradient-text">Laporan</span>
      </div>

      <div className="px-4">
        {/* Range chips */}
        <div className="flex gap-2 mb-4">
          {(['today', '7d', '30d'] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full text-label font-medium transition-all ${
                range === r ? 'active-category' : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {r === 'today' ? 'Hari ini' : r === '7d' ? '7 Hari' : '30 Hari'}
            </button>
          ))}
        </div>

        {/* Summary grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Omzet', value: formatRupiah(omzet), icon: 'payments', color: 'text-secondary' },
            { label: 'Transaksi', value: transaksi, icon: 'receipt_long', color: 'text-primary' },
            { label: 'Rata-rata', value: formatRupiah(avgBasket), icon: 'shopping_basket', color: 'text-tertiary' },
            { label: 'Item Terjual', value: itemTerjual, icon: 'inventory', color: 'text-secondary' },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4">
              <span className={`material-symbols-outlined text-[24px] ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              <p className={`text-numeral-lg font-bold mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-label text-on-surface-variant">{s.label}</p>
            </div>
          ))}
        </div>

        {ppnTotal > 0 && (
          <div className="glass-card p-4 mb-4">
            <p className="text-label text-on-surface-variant">Total PPN</p>
            <p className="text-numeral-lg text-primary font-bold">{formatRupiah(ppnTotal)}</p>
          </div>
        )}

        {/* Bar chart */}
        {days.length > 0 && (
          <div className="glass-card p-4 mb-4">
            <p className="text-body-md font-semibold text-on-surface mb-3">Omzet per Hari</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={days} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" tick={{ fill: '#918fa1', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#1f1f23', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e4e1e7', fontSize: 12 }}
                  formatter={(v) => formatRupiah(Number(v))}
                />
                <Bar dataKey="omzet" radius={[6, 6, 0, 0]}>
                  {days.map((_, i) => <Cell key={i} fill="#41eec2" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top products */}
        {topProducts.length > 0 && (
          <div className="glass-card p-4 mb-4">
            <p className="text-body-md font-semibold text-on-surface mb-3">Produk Terlaris</p>
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="text-xl">{p.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-body-md text-on-surface mb-1">
                    <span>{p.name}</span>
                    <span className="text-secondary font-bold">{p.qty}</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${(p.qty / maxQty) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment donut */}
        {transaksi > 0 && (
          <div className="glass-card p-4 mb-4">
            <p className="text-body-md font-semibold text-on-surface mb-3">Metode Pembayaran</p>
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                {(() => {
                  const segments = [
                    { value: paymentBreakdown.tunai / payTotal, color: '#41eec2', label: 'Tunai' },
                    { value: paymentBreakdown.qris / payTotal, color: '#c4c0ff', label: 'QRIS' },
                    { value: paymentBreakdown.transfer / payTotal, color: '#0be298', label: 'Transfer' },
                  ]
                  let offset = 0
                  return segments.map((s, i) => {
                    const circumference = 2 * Math.PI * 35
                    const dash = s.value * circumference
                    const el = (
                      <circle key={i} cx="50" cy="50" r="35" fill="none" stroke={s.color} strokeWidth="14"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset * circumference + circumference * 0.25}
                        transform="rotate(-90 50 50)"
                      />
                    )
                    offset += s.value
                    return el
                  })
                })()}
              </svg>
              <div className="flex flex-col gap-2">
                {[['Tunai', '#41eec2', paymentBreakdown.tunai], ['QRIS', '#c4c0ff', paymentBreakdown.qris], ['Transfer', '#0be298', paymentBreakdown.transfer]].map(([label, color, val]) => (
                  <div key={label as string} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: color as string }} />
                    <span className="text-label text-on-surface-variant">{label as string}</span>
                    <span className="text-label text-on-surface font-bold ml-auto">{formatRupiah(val as number)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Export */}
        <div className="glass-card p-4 mb-4">
          <p className="text-body-md font-semibold text-on-surface mb-3">Export Data</p>
          <button
            onClick={() => {
              const rows = [
                ['ID', 'Tanggal', 'Kasir', 'Total', 'Metode', 'Item'],
                ...txs.map((t) => [
                  t.id,
                  new Date(t.createdAt).toLocaleString('id-ID'),
                  t.kasirName,
                  t.total,
                  t.metode,
                  t.items.map((i) => `${i.name}×${i.qty}`).join('; '),
                ]),
              ]
              const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `laporan-${range}-${new Date().toISOString().slice(0,10)}.csv`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="w-full py-3 rounded-xl border border-secondary/30 text-secondary text-body-md font-medium flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export CSV
          </button>
        </div>

      <BottomNav />
    </div>
  )
}
