'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Customer } from '../types'
import { SEED_CUSTOMERS } from '../constants'

interface CustomerState {
  customers: Customer[]
  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => void
  updateCustomer: (id: string, data: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  addPoin: (customerId: string, poin: number) => void
  redeemPoin: (customerId: string, poin: number) => void
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: SEED_CUSTOMERS,

      addCustomer: (data) =>
        set((s) => ({ customers: [...s.customers, { ...data, id: nanoid(), createdAt: new Date().toISOString() }] })),

      updateCustomer: (id, data) =>
        set((s) => ({ customers: s.customers.map((c) => (c.id === id ? { ...c, ...data } : c)) })),

      deleteCustomer: (id) =>
        set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),

      addPoin: (customerId, poin) =>
        set((s) => ({ customers: s.customers.map((c) => c.id === customerId ? { ...c, poin: c.poin + poin } : c) })),

      redeemPoin: (customerId, poin) =>
        set((s) => ({ customers: s.customers.map((c) => c.id === customerId ? { ...c, poin: Math.max(0, c.poin - poin) } : c) })),
    }),
    { name: 'kasir-customers' }
  )
)
