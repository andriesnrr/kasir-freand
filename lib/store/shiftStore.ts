'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Shift } from '../types'

interface ShiftState {
  shiftHistory: Shift[]
  saveShift: (shift: Shift) => void
}

// FIXED: BUG 2 — persisted shift history store
export const useShiftStore = create<ShiftState>()(
  persist(
    (set) => ({
      shiftHistory: [],
      saveShift: (shift) => set((s) => ({ shiftHistory: [shift, ...s.shiftHistory] })),
    }),
    { name: 'kasir-shifts' }
  )
)
