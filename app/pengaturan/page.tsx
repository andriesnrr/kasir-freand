'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useSettingStore } from '@/lib/store/settingStore'
import { useShiftStore } from '@/lib/store/shiftStore'
import BottomNav from '@/components/layout/BottomNav'
import Input from '@/components/ui/Input'
import { toast } from 'sonner'

function Section({
  id, icon, title, children, expanded, onToggle,
}: {
  id: string; icon: string; title: string; children: React.ReactNode
  expanded: boolean; onToggle: () => void
}) {
  return (
    <div className="glass-card mb-3">
      <button onClick={onToggle} className="w-full px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="text-body-md font-semibold text-on-surface">{title}</span>
        </div>
        <span className={`material-symbols-outlined text-outline transition-transform ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
      </button>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

export default function PengaturanPage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useAuthStore((s) => s.logout)
  const currentShift = useAuthStore((s) => s.currentShift)
  const closeShift = useAuthStore((s) => s.closeShift)
  const saveShift = useShiftStore((s) => s.saveShift)
  const settings = useSettingStore()
  const [expanded, setExpanded] = useState<string | null>('toko')

  useEffect(() => {
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, router])

  const toggle = (id: string) => setExpanded((s) => s === id ? null : id)

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3" style={{ background: 'rgba(15,15,19,0.9)', backdropFilter: 'blur(12px)' }}>
        <span className="font-display text-title gradient-text">Pengaturan</span>
      </div>

      <div className="px-4">
        <Section id="toko" icon="🏪" title="Profil Toko" expanded={expanded === 'toko'} onToggle={() => toggle('toko')}>
          <div className="flex flex-col gap-3">
            <Input label="Nama Toko" defaultValue={settings.toko.nama} onBlur={(e) => settings.updateToko({ nama: e.target.value })} />
            <Input label="Alamat" defaultValue={settings.toko.alamat} onBlur={(e) => settings.updateToko({ alamat: e.target.value })} />
            <Input label="No. Telepon" defaultValue={settings.toko.phone} onBlur={(e) => settings.updateToko({ phone: e.target.value })} />
            <Input label="NPWP (opsional)" defaultValue={settings.toko.npwp ?? ''} onBlur={(e) => settings.updateToko({ npwp: e.target.value })} />
          </div>
        </Section>

        <Section id="ppn" icon="💰" title="PPN" expanded={expanded === 'ppn'} onToggle={() => toggle('ppn')}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-body-md text-on-surface">PPN Aktif</span>
              <button onClick={() => settings.updatePpn({ enabled: !settings.ppn.enabled })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.ppn.enabled ? 'bg-secondary' : 'bg-outline-variant'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${settings.ppn.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            {settings.ppn.enabled && (
              <>
                <Input label="Rate PPN (%)" type="number" defaultValue={settings.ppn.rate} onBlur={(e) => settings.updatePpn({ rate: Number(e.target.value) })} />
                <div>
                  <p className="text-label text-on-surface-variant mb-2">Mode</p>
                  <div className="flex gap-2">
                    {(['inclusive', 'exclusive'] as const).map((m) => (
                      <button key={m} onClick={() => settings.updatePpn({ mode: m })}
                        className={`flex-1 py-2 rounded-xl text-label font-medium capitalize ${settings.ppn.mode === m ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Section>

        <Section id="loyalty" icon="🎯" title="Program Loyalty" expanded={expanded === 'loyalty'} onToggle={() => toggle('loyalty')}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-body-md text-on-surface">Loyalty Aktif</span>
              <button onClick={() => settings.updateLoyalty({ enabled: !settings.loyalty.enabled })}
                className={`w-12 h-6 rounded-full transition-colors ${settings.loyalty.enabled ? 'bg-secondary' : 'bg-outline-variant'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${settings.loyalty.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            {settings.loyalty.enabled && (
              <>
                <Input label="Rp per Poin" type="number" defaultValue={settings.loyalty.rpPerPoin} onBlur={(e) => settings.updateLoyalty({ rpPerPoin: Number(e.target.value) })} />
                <Input label="Nilai 1 Poin (Rp)" type="number" defaultValue={settings.loyalty.poinPerRp} onBlur={(e) => settings.updateLoyalty({ poinPerRp: Number(e.target.value) })} />
                <Input label="Minimum Redeem (poin)" type="number" defaultValue={settings.loyalty.minRedeem} onBlur={(e) => settings.updateLoyalty({ minRedeem: Number(e.target.value) })} />
              </>
            )}
          </div>
        </Section>

        <Section id="struk" icon="🧾" title="Struk" expanded={expanded === 'struk'} onToggle={() => toggle('struk')}>
          <div className="flex flex-col gap-3">
            <Input label="Header Struk" defaultValue={settings.struk.header} onBlur={(e) => settings.updateStruk({ header: e.target.value })} />
            <Input label="Footer Struk" defaultValue={settings.struk.footer} onBlur={(e) => settings.updateStruk({ footer: e.target.value })} />
          </div>
        </Section>

        <Section id="notif" icon="🔔" title="Notifikasi" expanded={expanded === 'notif'} onToggle={() => toggle('notif')}>
          <div className="flex items-center justify-between">
            <span className="text-body-md text-on-surface">Notif Stok Rendah</span>
            <button onClick={() => settings.updateNotif({ lowStockEnabled: !settings.notif.lowStockEnabled })}
              className={`w-12 h-6 rounded-full transition-colors ${settings.notif.lowStockEnabled ? 'bg-secondary' : 'bg-outline-variant'}`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform mx-0.5 ${settings.notif.lowStockEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </Section>

        {currentUser?.role === 'owner' && (
          <Section id="users" icon="👥" title="Kasir & User" expanded={expanded === 'users'} onToggle={() => toggle('users')}>
            <div className="flex flex-col gap-2">
              {settings.users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-surface-container rounded-xl">
                  <div>
                    <p className="text-body-md text-on-surface">{u.name}</p>
                    <p className="text-label text-on-surface-variant capitalize">{u.role}</p>
                  </div>
                  <span className="text-label text-outline">PIN: {u.pin}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section id="data" icon="💾" title="Data" expanded={expanded === 'data'} onToggle={() => toggle('data')}>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                const data = {
                  products: JSON.parse(localStorage.getItem('kasir-products') ?? '{}'),
                  customers: JSON.parse(localStorage.getItem('kasir-customers') ?? '{}'),
                  transactions: JSON.parse(localStorage.getItem('kasir-transactions') ?? '{}'),
                  settings: JSON.parse(localStorage.getItem('kasir-settings') ?? '{}'),
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `kasir-freand-backup-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
                toast.success('Data berhasil diekspor')
              }}
              className="w-full py-3 rounded-xl border border-primary/30 text-primary text-body-md font-medium"
            >
              Ekspor Data JSON
            </button>
            {/* FIXED: BUG 9 — import backup */}
            <input
              type="file"
              accept=".json"
              id="import-backup"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  try {
                    const data = JSON.parse(ev.target?.result as string)
                    if (data.products) localStorage.setItem('kasir-products', JSON.stringify(data.products))
                    if (data.customers) localStorage.setItem('kasir-customers', JSON.stringify(data.customers))
                    if (data.transactions) localStorage.setItem('kasir-transactions', JSON.stringify(data.transactions))
                    if (data.settings) localStorage.setItem('kasir-settings', JSON.stringify(data.settings))
                    toast.success('Data berhasil diimpor. Silakan refresh halaman.')
                  } catch {
                    toast.error('File tidak valid')
                  }
                }
                reader.readAsText(file)
              }}
            />
            <label
              htmlFor="import-backup"
              className="w-full py-3 rounded-xl border border-secondary/30 text-secondary text-body-md font-medium text-center block cursor-pointer"
            >
              Impor Data JSON
            </label>
          </div>
        </Section>

        {/* FIXED: BUG 2 — Tutup Shift button, owner only, only when shift active */}
        {currentUser?.role === 'owner' && currentShift && !currentShift.closeTime && (
          <button
            onClick={() => {
              closeShift()
              const closedShift = { ...currentShift, closeTime: new Date().toISOString() }
              saveShift(closedShift)
              toast.success('Shift ditutup')
            }}
            className="w-full py-4 rounded-2xl border border-primary/30 text-primary text-body-md font-semibold mt-2"
          >
            Tutup Shift
          </button>
        )}

        <button
          onClick={() => { logout(); router.push('/login') }}
          className="w-full py-4 rounded-2xl border border-error/30 text-error text-body-md font-semibold mt-2"
        >
          Keluar
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
