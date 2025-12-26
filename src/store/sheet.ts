import { create } from 'zustand'

type SheetStore = {
  isSheetOpen: boolean
  setIsSheetOpen: (open: boolean) => void
}

export const useSheetStore = create<SheetStore>((set) => ({
  isSheetOpen: false,
  setIsSheetOpen: (open) => set({ isSheetOpen: open }),
}))
