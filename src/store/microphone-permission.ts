import { create } from 'zustand'

type Store = {
  MICROPHONE_ACCESS: boolean
  setMicrophonePermission: (permission: boolean) => void
}

export const useMicrophonePermission = create<Store>((set) => ({
  MICROPHONE_ACCESS: false,
  setMicrophonePermission: (permission) => set({ MICROPHONE_ACCESS: permission }),
}))

export const checkMicrophonePermissions = async () => {
  // TODO: implementar checagem real via Permissions API se necessário
  return false
}
