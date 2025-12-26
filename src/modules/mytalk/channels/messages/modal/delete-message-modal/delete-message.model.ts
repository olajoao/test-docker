import { queryClient } from "@/lib/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { channelMessageKeys } from "../../channel.messages.keys";
import { useDeleteMessage } from "./delete-message.hooks";

export const useDeleteMessageModel = () => {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSuccessMutation() {
    toast.success("Mensagem excluida com sucesso!");
    setIsOpen(false);
    await queryClient.invalidateQueries({
      queryKey: [channelMessageKeys.listInfinit],
    });
  }
  const { deleteMessageMutation, isLoadingDeleteMessage } = useDeleteMessage(
    handleSuccessMutation,
  );

  async function handleDeleteMessage(messageId: number) {
    await deleteMessageMutation(messageId);
  }

  return {
    state: { isOpen, isLoadingDeleteMessage },
    data: {},
    actions: { handleDeleteMessage, setIsOpen },
  };
};
