import { create } from 'zustand'

export const ModalType = {
  HandleChannel: 'HandleChannel',
  HandleChannelGroup: 'HandleChannelGroup',
  HandleEditChannelGroup: 'HandleEditChannelGroup',
  HandleChannelSheet: 'HandleChannelSheet',
  HandleEditMessage: 'HandleEditMessage',
  HandleDepartment: 'HandleDepartment',
  HandleEditDepartment: 'HandleEditDepartment',
  PreviewImage: 'PreviewImage',
  PreviewAudio: 'PreviewAudio',
  HandleUserProfile: 'HandleUserProfile',
  HandleUserProfileEdit: 'HandleUserProfileEdit',
} as const

export type ModalType = (typeof ModalType)[keyof typeof ModalType]

type ModalState =
  | {
      type: ModalType
      id?: string | number
    }
  | null

type ModalStore = {
  openModal: ModalState
  setOpenModal: (modal: ModalState) => void
  closeModal: () => void
}

export const useNewModalStore = create<ModalStore>((set) => ({
  openModal: null,
  setOpenModal: (modal) => set({ openModal: modal }),
  closeModal: () => set({ openModal: null }),
}))
