import { useMutation } from "@tanstack/react-query";
import { channelMessageKeys } from "../../channel.messages.keys";
import { deleteMessageService } from "./delete-message.service";

export const useDeleteMessage = (callback: () => void) => {
  const {
    mutateAsync: deleteMessageMutation,
    isPending: isLoadingDeleteMessage,
  } = useMutation({
    mutationKey: [channelMessageKeys.delete],
    mutationFn: async (messageId: number) =>
      await deleteMessageService(messageId),
    onSuccess: callback,
  });

  return {
    deleteMessageMutation,
    isLoadingDeleteMessage,
  };
};
