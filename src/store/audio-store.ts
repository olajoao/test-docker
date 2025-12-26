import { create } from 'zustand'

export type RecordedAudio = {
  blob: Blob
  blobURL?: string
  duration?: number
  startTime?: number
  stopTime?: number
  options?: {
    audioBitsPerSecond?: number
    mimeType?: string
  }
}

type AudioStore = {
  audio: RecordedAudio | null
  setAudio: (audio: RecordedAudio | null) => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  audio: null,
  setAudio: (audio) => set({ audio }),
}))
