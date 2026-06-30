import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID')
}

export function formatTanggal(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function generateTxId(): string {
  const key = 'kasir-tx-counter'
  const current = parseInt(typeof window !== 'undefined' ? (localStorage.getItem(key) ?? '1000') : '1000')
  const next = current + 1
  if (typeof window !== 'undefined') localStorage.setItem(key, String(next))
  return `TRX-${next}`
}

export function hitungPPN(
  price: number,
  rate: number,
  mode: 'inclusive' | 'exclusive'
): { hargaAsal: number; ppn: number; total: number } {
  if (mode === 'exclusive') {
    const ppn = price * (rate / 100)
    return { hargaAsal: price, ppn, total: price + ppn }
  } else {
    const ppn = price * (rate / (100 + rate))
    return { hargaAsal: price - ppn, ppn, total: price }
  }
}

export function hitungPoin(total: number, rpPerPoin: number): number {
  if (rpPerPoin <= 0) return 0
  return Math.floor(total / rpPerPoin)
}

export function hitungRedeemValue(poin: number, poinPerRp: number): number {
  if (poinPerRp <= 0) return 0
  return poin * poinPerRp
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ENHANCEMENT: 3
export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} jam lalu`
  return `${Math.floor(hrs / 24)} hari lalu`
}
