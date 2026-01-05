import { create } from 'zustand'

type Store = {
  files: FileList | null
  imageURL?: string
  upload: (files?: FileList) => void
}

export const useImageAndVideoStore = create<Store>((set) => ({
  files: null,
  imageURL: undefined,
  upload: (uploaded) =>
    set(() => ({
      files: uploaded ?? null,
      imageURL: uploaded?.length ? URL.createObjectURL(uploaded[0]) : '',
    })),
}))
