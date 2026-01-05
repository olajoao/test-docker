import { ModalType as LegacyModalType, useModalStore } from '../modules/mytalk/stores/modal'
import { ModalType as NewModalType, useNewModalStore } from '../modules/mytalk/stores/new-modal'

// Compat: MyTalk usa ModalType de ambos os stores; mantemos a enum de `store/modal` como fonte principal.
export type ModalType = LegacyModalType

export const useModal = (type: LegacyModalType) => {
  const { openModal, setOpenModal, newSetOpenModal, newOpenModal } = useModalStore()

  return {
    isOpen: openModal === type,
    toggleModal: (isOpen: boolean) => setOpenModal(isOpen ? type : null),
    newIsOpen: newOpenModal?.type === type,
    newSetOpenModal,
  }
}

export const useNewModal = (type: NewModalType, id?: string | number) => {
  const { openModal, setOpenModal, closeModal } = useNewModalStore()

  return {
    isOpen: openModal?.type === type && openModal?.id === id,
    openModal: () => setOpenModal({ type, id }),
    closeModal,
    toggleModal: (isOpen: boolean) => setOpenModal(isOpen ? { type, id } : null),
  }
}
