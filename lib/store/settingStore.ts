'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { User } from '../types'
import { SEED_USERS, SEED_SETTINGS, CATEGORIES } from '../constants'

interface SettingState {
  toko: { nama: string; alamat: string; phone: string; npwp?: string }
  struk: { header: string; footer: string; showPpn: boolean; showPoin: boolean; ukuran: '58mm' | '80mm' | 'A4' }
  ppn: { enabled: boolean; rate: number; mode: 'inclusive' | 'exclusive' }
  loyalty: { enabled: boolean; rpPerPoin: number; poinPerRp: number; minRedeem: number }
  notif: { lowStockEnabled: boolean; lowStockThreshold: number }
  users: User[]
  categories: string[] // ENHANCEMENT: 5
  updateCategories: (cats: string[]) => void
  updateToko: (data: Partial<SettingState['toko']>) => void
  updateStruk: (data: Partial<SettingState['struk']>) => void
  updatePpn: (data: Partial<SettingState['ppn']>) => void
  updateLoyalty: (data: Partial<SettingState['loyalty']>) => void
  updateNotif: (data: Partial<SettingState['notif']>) => void
  addUser: (user: Omit<User, 'id'>) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      toko: SEED_SETTINGS.toko,
      struk: { header: 'Terima kasih telah berbelanja!', footer: 'Sampai jumpa lagi 😊', showPpn: true, showPoin: true, ukuran: '80mm' },
      ppn: SEED_SETTINGS.ppn,
      loyalty: SEED_SETTINGS.loyalty,
      notif: SEED_SETTINGS.notif,
      users: SEED_USERS,

      updateToko: (data) => set((s) => ({ toko: { ...s.toko, ...data } })),
      updateStruk: (data) => set((s) => ({ struk: { ...s.struk, ...data } })),
      updatePpn: (data) => set((s) => ({ ppn: { ...s.ppn, ...data } })),
      updateLoyalty: (data) => set((s) => ({ loyalty: { ...s.loyalty, ...data } })),
      updateNotif: (data) => set((s) => ({ notif: { ...s.notif, ...data } })),

      addUser: (data) =>
        set((s) => ({ users: [...s.users, { ...data, id: nanoid() }] })),
      updateUser: (id, data) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)) })),
      deleteUser: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
    }),
    { name: 'kasir-settings' }
  )
)
