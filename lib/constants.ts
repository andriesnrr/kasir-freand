import type { User, Product, Bundle, Customer } from './types'

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'Admin', role: 'owner', pin: '1234' },
  { id: 'u2', name: 'Budi', role: 'kasir', pin: '5678' },
  { id: 'u3', name: 'Sari', role: 'kasir', pin: '9012' },
]

export const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Nasi Goreng', price: 15000, stock: 20, lowStockThreshold: 5, satuan: 'porsi', emoji: '🍜', category: 'Makanan', ppn: 'default', variants: [], isActive: true, createdAt: new Date().toISOString() },
  { id: 'p2', name: 'Es Teh Manis', price: 5000, stock: 50, lowStockThreshold: 10, satuan: 'gelas', emoji: '🧃', category: 'Minuman', ppn: 'none', variants: [], isActive: true, createdAt: new Date().toISOString() },
  { id: 'p3', name: 'Ayam Goreng', price: 20000, stock: 15, lowStockThreshold: 5, satuan: 'porsi', emoji: '🍗', category: 'Makanan', ppn: 'default', variants: [{ id: 'v1', name: 'Paha', priceOverride: 20000 }, { id: 'v2', name: 'Dada', priceOverride: 18000 }], isActive: true, createdAt: new Date().toISOString() },
  { id: 'p4', name: 'Kopi Susu', price: 12000, stock: 30, lowStockThreshold: 5, satuan: 'gelas', emoji: '☕', category: 'Minuman', ppn: 'none', variants: [{ id: 'v3', name: 'Panas', priceOverride: 12000 }, { id: 'v4', name: 'Dingin', priceOverride: 14000 }], isActive: true, createdAt: new Date().toISOString() },
  { id: 'p5', name: 'Pisang Goreng', price: 8000, stock: 5, lowStockThreshold: 5, satuan: 'porsi', emoji: '🍌', category: 'Snack', ppn: 'none', variants: [], isActive: true, createdAt: new Date().toISOString() },
  { id: 'p6', name: 'Indomie Rebus', price: 10000, stock: 40, lowStockThreshold: 10, satuan: 'porsi', emoji: '🍜', category: 'Makanan', ppn: 'none', variants: [], isActive: true, createdAt: new Date().toISOString() },
  { id: 'p7', name: 'Roti Bakar', price: 12000, stock: 18, lowStockThreshold: 5, satuan: 'porsi', emoji: '🍞', category: 'Snack', ppn: 'none', variants: [], isActive: true, createdAt: new Date().toISOString() },
  { id: 'p8', name: 'Jus Alpukat', price: 15000, stock: 0, lowStockThreshold: 5, satuan: 'gelas', emoji: '🥤', category: 'Minuman', ppn: 'none', variants: [], isActive: true, createdAt: new Date().toISOString() },
]

export const SEED_BUNDLES: Bundle[] = [
  { id: 'b1', name: 'Paket Makan Siang', emoji: '🎁', description: 'Nasi Goreng + Es Teh Manis', items: [{ productId: 'p1', qty: 1 }, { productId: 'p2', qty: 1 }], price: 17000, isActive: true, createdAt: new Date().toISOString() },
  { id: 'b2', name: 'Paket Ayam Komplit', emoji: '🎁', description: 'Ayam Goreng + Indomie + Es Teh', items: [{ productId: 'p3', qty: 1 }, { productId: 'p6', qty: 1 }, { productId: 'p2', qty: 1 }], price: 30000, isActive: true, createdAt: new Date().toISOString() },
]

export const SEED_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Budi Santoso', phone: '081234567890', poin: 150, totalBelanja: 450000, totalTransaksi: 12, createdAt: new Date().toISOString() },
  { id: 'c2', name: 'Siti Rahayu', phone: '085678901234', poin: 80, totalBelanja: 240000, totalTransaksi: 8, createdAt: new Date().toISOString() },
]

export const SEED_SETTINGS = {
  toko: { nama: 'Warung Freand', alamat: 'Jl. Contoh No. 1', phone: '08123456789' },
  ppn: { enabled: true, rate: 11, mode: 'exclusive' as const },
  loyalty: { enabled: true, rpPerPoin: 1000, poinPerRp: 100, minRedeem: 10 },
  notif: { lowStockEnabled: true, lowStockThreshold: 5 },
}

export const EMOJI_LIST = ['🍔', '🍕', '🍜', '🍦', '🧃', '☕', '🍰', '🥤', '🍗', '🛒', '📦', '🎁', '👕', '🧴', '🖊️', '📱', '🍌', '🥟', '🥥', '🍞']

export const CATEGORIES = ['Makanan', 'Minuman', 'Snack', 'Lainnya']
