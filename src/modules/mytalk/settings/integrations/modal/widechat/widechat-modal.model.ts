import { useContactUsers } from "@/modules/mytalk/users/users.hooks"
import { useState } from "react"

export const useWidechatModalModel = () => {
  const { contactList, isLoadingContatcs } = useContactUsers()
  const [isOpen, setIsOpen] = useState(false)

 // const nonWidechatUsers = contactList?.data.filter((user) => !user.wideChat )

  function toggleModal(currentState: boolean) {
    setIsOpen(currentState)
  }    
  return {
    state: { isOpen, isLoadingUsers: isLoadingContatcs },
    data: { users: contactList?.data || [] },
    actions: { 
      toggleModal,
    }
  }
}
