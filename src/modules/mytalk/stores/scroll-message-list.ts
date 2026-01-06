import { create } from 'zustand'

type ScrollStore = {
  scroll: boolean
  setScroll: (value: boolean) => void
}

export const useScrollMessageListStore = create<ScrollStore>((set) => ({
  scroll: false,
  setScroll: (value) => set({ scroll: value }),
}))
