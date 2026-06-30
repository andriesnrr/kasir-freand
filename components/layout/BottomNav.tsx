'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'

const tabs = [
  { href: '/kasir', label: 'Kasir', icon: 'point_of_sale' },
  { href: '/produk', label: 'Produk', icon: 'inventory_2' },
  { href: '/pelanggan', label: 'Pelanggan', icon: 'people' },
  { href: '/laporan', label: 'Laporan', icon: 'bar_chart' },
  { href: '/pengaturan', label: 'Pengaturan', icon: 'settings' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-30"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href)
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 flex-1 relative">
              <div className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-all ${active ? 'bg-primary/20' : ''}`}>
                <span className={`material-symbols-outlined text-[22px] ${active ? 'text-primary' : 'text-outline'}`}
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                  {tab.icon}
                </span>
                {tab.href === '/kasir' && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? 'text-primary' : 'text-outline'}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
