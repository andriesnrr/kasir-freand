'use client'
import { useCartStore } from '@/lib/store/cartStore'
import { formatRupiah } from '@/lib/utils'

interface CartBarProps {
  onOpen: () => void
}

export default function CartBar({ onOpen }: CartBarProps) {
  const itemCount = useCartStore((s) => s.itemCount())
  const total = useCartStore((s) => s.total())

  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 z-20">
      <button
        onClick={onOpen}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl gradient-btn text-on-primary shadow-lg active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-on-primary/20 flex items-center justify-center text-on-primary text-label font-bold">
            {itemCount}
          </span>
          <span className="font-semibold text-body-md">Lihat Keranjang</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-body-lg">{formatRupiah(total)}</span>
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </div>
      </button>
    </div>
  )
}
