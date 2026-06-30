'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Product, Bundle, StockLog } from '../types'
import { SEED_PRODUCTS, SEED_BUNDLES } from '../constants'

interface ProductState {
  products: Product[]
  bundles: Bundle[]
  stockLogs: StockLog[]
  addProduct: (data: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  decrementStock: (productId: string, qty: number) => void
  restoreStock: (productId: string, qty: number) => void
  updateStockBulk: (updates: { id: string; stock: number }[]) => void
  addBundle: (data: Omit<Bundle, 'id' | 'createdAt'>) => void
  updateBundle: (id: string, data: Partial<Bundle>) => void
  deleteBundle: (id: string) => void
  lowStockProducts: () => Product[]
  outOfStockProducts: () => Product[]
  isBundleAvailable: (bundle: Bundle) => boolean
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,
      bundles: SEED_BUNDLES,
      stockLogs: [],

      addProduct: (data) =>
        set((s) => ({ products: [...s.products, { ...data, id: nanoid(), createdAt: new Date().toISOString() }] })),

      updateProduct: (id, data) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)) })),

      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      decrementStock: (productId, qty) => {
        const p = get().products.find((x) => x.id === productId)
        if (!p) return
        const before = p.stock
        const after = Math.max(0, before - qty)
        set((s) => ({
          products: s.products.map((x) => (x.id === productId ? { ...x, stock: after } : x)),
          stockLogs: [...s.stockLogs, { id: nanoid(), productId, type: 'sale', before, after, delta: -(before - after), createdAt: new Date().toISOString() }],
        }))
      },

      restoreStock: (productId, qty) => {
        const p = get().products.find((x) => x.id === productId)
        if (!p) return
        const before = p.stock
        const after = before + qty
        set((s) => ({
          products: s.products.map((x) => (x.id === productId ? { ...x, stock: after } : x)),
          stockLogs: [...s.stockLogs, { id: nanoid(), productId, type: 'void', before, after, delta: qty, createdAt: new Date().toISOString() }],
        }))
      },

      updateStockBulk: (updates) => {
        set((s) => {
          const logs: StockLog[] = []
          const products = s.products.map((p) => {
            const upd = updates.find((u) => u.id === p.id)
            if (!upd) return p
            logs.push({ id: nanoid(), productId: p.id, type: 'opname', before: p.stock, after: upd.stock, delta: upd.stock - p.stock, createdAt: new Date().toISOString() })
            return { ...p, stock: upd.stock }
          })
          return { products, stockLogs: [...s.stockLogs, ...logs] }
        })
      },

      addBundle: (data) =>
        set((s) => ({ bundles: [...s.bundles, { ...data, id: nanoid(), createdAt: new Date().toISOString() }] })),

      updateBundle: (id, data) =>
        set((s) => ({ bundles: s.bundles.map((b) => (b.id === id ? { ...b, ...data } : b)) })),

      deleteBundle: (id) =>
        set((s) => ({ bundles: s.bundles.filter((b) => b.id !== id) })),

      lowStockProducts: () =>
        get().products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold && p.isActive),

      outOfStockProducts: () =>
        get().products.filter((p) => p.stock === 0 && p.isActive),

      isBundleAvailable: (bundle) => {
        const products = get().products
        return bundle.items.every((item) => {
          const p = products.find((x) => x.id === item.productId)
          return p && p.stock >= item.qty
        })
      },
    }),
    { name: 'kasir-products' }
  )
)
