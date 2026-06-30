'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { User, Shift } from '../types'
import { useShiftStore } from './shiftStore'

interface AuthState {
  currentUser: User | null
  currentShift: Shift | null
  isLoggedIn: boolean
  login: (user: User) => void
  logout: () => void
  openShift: (kasAwal: number) => void
  closeShift: () => void
  updateShiftStats: (omzet: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      currentShift: null,
      isLoggedIn: false,

      login: (user) => set({ currentUser: user, isLoggedIn: true }),

      logout: () => {
        // FIXED: BUG 2 — close and save shift before logout
        const { currentShift } = get()
        if (currentShift && !currentShift.closeTime) {
          const closedShift = { ...currentShift, closeTime: new Date().toISOString() }
          useShiftStore.getState().saveShift(closedShift)
        } else if (currentShift) {
          useShiftStore.getState().saveShift(currentShift)
        }
        set({ currentUser: null, currentShift: null, isLoggedIn: false })
      },

      openShift: (kasAwal) => {
        const user = get().currentUser
        if (!user) return
        set({
          currentShift: {
            id: nanoid(),
            userId: user.id,
            kasirName: user.name,
            openTime: new Date().toISOString(),
            kasAwal,
            totalOmzet: 0,
            totalTransaksi: 0,
          },
        })
      },

      closeShift: () => {
        set((state) => ({
          currentShift: state.currentShift
            ? { ...state.currentShift, closeTime: new Date().toISOString() }
            : null,
        }))
      },
    }),
    { name: 'kasir-auth' }
  )
)
