import { useWhoAmIUserContext } from "@/context/who-am-i-user";
import { useModal } from "@/hooks/use-modal";
import { queryClient } from "@/lib/react-query";
import { channelMessageKeys } from "@/modules/mytalk/channels/messages/channel.messages.keys";
import { sendImageMessageService } from "@/modules/mytalk/chat/chat.service";
import { useImageAndVideoStore } from "@/store/image-n-video-store";
import { ModalType } from "@/store/modal";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMyTalkChannelId } from "@/modules/mytalk/hooks/use-current-channel-id";

export const usePreviewFilesModel = () => {
  const channelId = useMyTalkChannelId();
  const { userIdFromStorage: userId } = useWhoAmIUserContext();
  const { files, upload } = useImageAndVideoStore();
  const { isOpen, toggleModal } = useModal(ModalType.PreviewImage);

  const {
    mutateAsync: sendImageMessageMutation,
    isPending: isSendingImageMessage,
  } = useMutation({
    mutationKey: [channelMessageKeys.create],
    mutationFn: sendImageMessageService,
    onSuccess: handleSuccessMutation,
  });

  async function handleSuccessMutation() {
    toggleModal(false);
    upload();
    return await queryClient.invalidateQueries({
      queryKey: [channelMessageKeys.listInfinit],
    });
  }

  function getFormaDataPayload() {
    const messagePayload: FormData = new FormData();
    messagePayload.append("date", format(new Date(), "dd/MM/yyyy"));
    messagePayload.append("message_type", "1");
    if (userId) {
      messagePayload.append("user_id", userId);
    }
    messagePayload.append("channel_id", String(channelId));

    if (files?.length) {
      Array.from(files).forEach((file, index) => {
        messagePayload.append(`attachments[${index}]`, file);
      });
    }

    return messagePayload;
  }

  function handleSendImages() {
    if (!userId || !channelId) return;
    const messagePayload = getFormaDataPayload();
    sendImageMessageMutation(messagePayload);
  }

  return {
    state: { isOpen, isSendingImageMessage },
    data: {},
    actions: { handleSendImages, toggleModal },
  };
};
