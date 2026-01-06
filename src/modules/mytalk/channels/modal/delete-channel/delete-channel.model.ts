import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { channelKeys } from "../../channel.keys";
import { deleteChannelService } from "./delete-channel.service";
import { useNavigate } from "@tanstack/react-router";

export const useDeleteChannelModel = ({ channelId }: { channelId: number }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteChannelFn, isPending: isLoadingDeleteChannel } =
    useMutation({
      mutationKey: [channelKeys.delete],
      mutationFn: () => deleteChannelService(channelId),
      onSuccess: () => {
        return handleMutationSuccess("Conversa removida", channelKeys.list);
      },
    });

  async function handleMutationSuccess(
    message: string,
    keyToInvalidade: string,
  ) {
    toast.success(message);
    setIsOpen(false);
    await queryClient.invalidateQueries({
      queryKey: [keyToInvalidade],
    });

    return navigate({ to: "/mytalk" });
  }

  async function handleDeleteChannel() {
    return await deleteChannelFn();
  }

  return {
    state: { isOpen, isLoadingDeleteChannel },
    data: {},
    actions: { setIsOpen, handleDeleteChannel },
  };
};
