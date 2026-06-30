'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateTxId } from '../utils'
import type { Transaction } from '../types'
import { useProductStore } from './productStore'

interface TxState {
  history: Transaction[]
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Transaction
  voidTransaction: (id: string, reason: string, voidBy: string) => void
  getByDateRange: (start: Date, end: Date) => Transaction[]
  getDailySummary: (date: Date) => { omzet: number; transaksi: number; avgBasket: number; itemTerjual: number; ppnTotal: number }
}

export const useTxStore = create<TxState>()(
  persist(
    (set, get) => ({
      history: [],

      addTransaction: (tx) => {
        const newTx: Transaction = { ...tx, id: generateTxId(), createdAt: new Date().toISOString() }
        set((s) => ({ history: [newTx, ...s.history] }))
        return newTx
      },

      voidTransaction: (id, reason) => {
        set((s) => ({
          history: s.history.map((t) =>
            t.id === id ? { ...t, isVoid: true, voidReason: reason } : t
          ),
        }))
      },

      getByDateRange: (start, end) => {
        return get().history.filter((t) => {
          const d = new Date(t.createdAt)
          return d >= start && d <= end && !t.isVoid
        })
      },

      getDailySummary: (date) => {
        const start = new Date(date); start.setHours(0, 0, 0, 0)
        const end = new Date(date); end.setHours(23, 59, 59, 999)
        const txs = get().getByDateRange(start, end)
        const omzet = txs.reduce((s, t) => s + t.total, 0)
        const itemTerjual = txs.reduce((s, t) => s + t.items.reduce((si, i) => si + i.qty, 0), 0)
        const ppnTotal = txs.reduce((s, t) => s + t.ppnAmount, 0)
        return {
          omzet,
          transaksi: txs.length,
          avgBasket: txs.length > 0 ? omzet / txs.length : 0,
          itemTerjual,
          ppnTotal,
        }
      },
    }),
    { name: 'kasir-transactions' }
  )
)
