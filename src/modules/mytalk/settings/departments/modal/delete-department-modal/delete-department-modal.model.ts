import { useState } from "react";
import { toast } from "sonner";
import { useDeleteDepartment } from "./delete-department-modal.hooks";

export const useDeleteDepartmentModel = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleSuccessMutation() {
    toast.success("Departamento excluido com sucesso!");
    setIsOpen(false);
  }

  const { deleteDepartmentMutation, isLoadingDeleteDepartment } =
    useDeleteDepartment(handleSuccessMutation);

  async function handleDeleteDepartment(messageId: number) {
    await deleteDepartmentMutation(messageId);
  }

  return {
    state: { isOpen, isLoadingDeleteDepartment },
    data: {},
    actions: { setIsOpen, handleDeleteDepartment },
  };
};
