'use client'
import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { CartItem, HoldTransaction, Product, DiscountType } from '../types'
import { useSettingStore } from './settingStore'
import { useProductStore } from './productStore'

interface CartState {
  items: CartItem[]
  holds: HoldTransaction[]
  globalDiscount: number
  discountType: DiscountType
  customerId: string | null
  poinRedeem: number
  note: string
  addItem: (product: Product, variantId?: string) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQty: (productId: string, delta: number, variantId?: string) => void
  setItemDiscount: (productId: string, discount: number, variantId?: string) => void
  setItemNote: (productId: string, note: string, variantId?: string) => void
  setGlobalDiscount: (amount: number, type: DiscountType) => void
  setCustomer: (customerId: string | null) => void
  setPoinRedeem: (poin: number) => void
  holdCart: () => void
  restoreHold: (holdId: string) => void
  deleteHold: (holdId: string) => void
  clearCart: () => void
  subtotal: () => number
  ppnAmount: () => number
  discountAmount: () => number
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  holds: [],
  globalDiscount: 0,
  discountType: 'nominal',
  customerId: null,
  poinRedeem: 0,
  note: '',

  addItem: (product, variantId) => {
    const variant = variantId ? product.variants.find((v) => v.id === variantId) : undefined
    const price = variant ? variant.priceOverride : product.price
    const name = variant ? `${product.name} (${variant.name})` : product.name
    const settings = useSettingStore.getState()
    const ppnRate = product.ppn === 'none' ? 0 : product.ppn === 'default' ? (settings.ppn.enabled ? settings.ppn.rate : 0) : (product.ppn as number)

    set((s) => {
      const key = productKey(product.id, variantId)
      const existing = s.items.find((i) => productKey(i.productId, i.variantId) === key)
      if (existing) {
        return { items: s.items.map((i) => productKey(i.productId, i.variantId) === key ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { items: [...s.items, { productId: product.id, variantId, name, price, qty: 1, emoji: product.emoji, ppnRate, itemDiscount: 0 }] }
    })
  },

  removeItem: (productId, variantId) =>
    set((s) => ({ items: s.items.filter((i) => productKey(i.productId, i.variantId) !== productKey(productId, variantId)) })),

  updateQty: (productId, delta, variantId) =>
    set((s) => ({
      items: s.items.flatMap((i) => {
        if (productKey(i.productId, i.variantId) !== productKey(productId, variantId)) return [i]
        const qty = i.qty + delta
        return qty <= 0 ? [] : [{ ...i, qty }]
      }),
    })),

  setItemDiscount: (productId, discount, variantId) =>
    set((s) => ({ items: s.items.map((i) => productKey(i.productId, i.variantId) === productKey(productId, variantId) ? { ...i, itemDiscount: discount } : i) })),

  setItemNote: (productId, note, variantId) =>
    set((s) => ({ items: s.items.map((i) => productKey(i.productId, i.variantId) === productKey(productId, variantId) ? { ...i, note } : i) })),

  setGlobalDiscount: (amount, type) => set({ globalDiscount: amount, discountType: type }),

  setCustomer: (customerId) => set({ customerId, poinRedeem: 0 }),

  setPoinRedeem: (poin) => set({ poinRedeem: poin }),

  holdCart: () => {
    const s = get()
    if (s.items.length === 0) return
    const hold: HoldTransaction = {
      id: nanoid(),
      items: [...s.items],
      discount: s.globalDiscount,
      discountType: s.discountType,
      customerId: s.customerId ?? undefined,
      note: s.note,
      createdAt: new Date().toISOString(),
    }
    set({ holds: [...s.holds, hold], items: [], globalDiscount: 0, discountType: 'nominal', customerId: null, poinRedeem: 0, note: '' })
  },

  restoreHold: (holdId) => {
    const hold = get().holds.find((h) => h.id === holdId)
    if (!hold) return
    set((s) => ({
      items: hold.items,
      globalDiscount: hold.discount,
      discountType: hold.discountType,
      customerId: hold.customerId ?? null,
      holds: s.holds.filter((h) => h.id !== holdId),
    }))
  },

  deleteHold: (holdId) => set((s) => ({ holds: s.holds.filter((h) => h.id !== holdId) })),

  clearCart: () => set({ items: [], globalDiscount: 0, discountType: 'nominal', customerId: null, poinRedeem: 0, note: '' }),

  subtotal: () => {
    return get().items.reduce((sum, i) => sum + (i.price - i.itemDiscount) * i.qty, 0)
  },

  ppnAmount: () => {
    const settings = useSettingStore.getState()
    if (!settings.ppn.enabled) return 0
    return get().items.reduce((sum, i) => {
      if (i.ppnRate === 0) return sum
      const itemTotal = (i.price - i.itemDiscount) * i.qty
      if (settings.ppn.mode === 'exclusive') return sum + itemTotal * (i.ppnRate / 100)
      else return sum + itemTotal * (i.ppnRate / (100 + i.ppnRate))
    }, 0)
  },

  discountAmount: () => {
    const s = get()
    const subtotal = s.subtotal()
    if (s.discountType === 'persen') return subtotal * (s.globalDiscount / 100)
    return s.globalDiscount
  },

  total: () => {
    const s = get()
    const settings = useSettingStore.getState()
    const poinValue = s.poinRedeem * settings.loyalty.poinPerRp
    return Math.max(0, s.subtotal() + s.ppnAmount() - s.discountAmount() - poinValue)
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}))

function productKey(productId: string, variantId?: string) {
  return `${productId}-${variantId ?? ''}`
}
