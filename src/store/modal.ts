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
      id?: string
    }
  | null

type ModalStore = {
  openModal: ModalType | null
  newOpenModal: ModalState
  setOpenModal: (modal: ModalType | null) => void
  newSetOpenModal: (modal: ModalState) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  newOpenModal: null,
  setOpenModal: (modal) => set({ openModal: modal }),
  newSetOpenModal: (modal) => set({ newOpenModal: modal }),
  closeModal: () => set({ openModal: null }),
}))
