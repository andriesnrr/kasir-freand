export type Role = 'owner' | 'kasir'

export interface User {
  id: string
  name: string
  role: Role
  pin: string
}

export interface Shift {
  id: string
  userId: string
  kasirName: string
  openTime: string
  closeTime?: string
  kasAwal: number
  totalOmzet: number
  totalTransaksi: number
}

export interface Variant {
  id: string
  name: string
  priceOverride: number
}

export interface Product {
  id: string
  name: string
  price: number
  memberPrice?: number
  stock: number
  lowStockThreshold: number
  satuan: string
  emoji: string
  image?: string
  barcode?: string
  category: string
  ppn: 'none' | 'default' | number
  variants: Variant[]
  isActive: boolean
  createdAt: string
}

export interface BundleItem {
  productId: string
  qty: number
}

export interface Bundle {
  id: string
  name: string
  description: string
  emoji: string
  items: BundleItem[]
  price: number
  isActive: boolean
  createdAt: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  poin: number
  totalBelanja: number
  totalTransaksi: number
  note?: string
  createdAt: string
}

export interface CartItem {
  productId: string
  variantId?: string
  name: string
  price: number
  qty: number
  emoji: string
  ppnRate: number
  itemDiscount: number
  note?: string
}

export interface TxItem {
  productId: string
  variantId?: string
  name: string
  price: number
  qty: number
  ppnRate: number
  ppnAmount: number
  itemDiscount: number
  subtotal: number
  note?: string
}

export type PaymentMethod = 'tunai' | 'qris' | 'transfer'
export type DiscountType = 'nominal' | 'persen'

export interface Transaction {
  id: string
  kasirId: string
  kasirName: string
  shiftId: string
  customerId?: string
  items: TxItem[]
  subtotal: number
  ppnAmount: number
  discount: number
  discountType: DiscountType
  total: number
  metode: PaymentMethod
  bayar: number
  kembalian: number
  poinDidapat: number
  poinDipakai: number
  note?: string
  isVoid: boolean
  voidReason?: string
  voidBy?: string
  createdAt: string
}

export interface HoldTransaction {
  id: string
  items: CartItem[]
  discount: number
  discountType: DiscountType
  customerId?: string
  note?: string
  createdAt: string
}

export interface StockLog {
  id: string
  productId: string
  type: 'sale' | 'opname' | 'void' | 'manual'
  before: number
  after: number
  delta: number
  note?: string
  createdAt: string
}
