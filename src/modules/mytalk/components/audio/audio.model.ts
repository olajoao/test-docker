import { useWhoAmIUserContext } from "@/context/who-am-i-user";
import { queryClient } from "@/lib/react-query";
import { channelMessageKeys } from "@/modules/mytalk/channels/messages/channel.messages.keys";
import { sendAudioMessageService } from "@/modules/mytalk/chat/chat.service";
import { useAudioStore } from "@/store/audio-store";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMyTalkChannelId } from "@/modules/mytalk/hooks/use-current-channel-id";

export const useAudioModel = () => {
  const channelId = useMyTalkChannelId();
  const { user } = useWhoAmIUserContext();
  const { audio, setAudio } = useAudioStore();

  const {
    mutateAsync: sendAudioMessageMutation,
    isPending: isSendingAudioMessage,
  } = useMutation({
    mutationKey: [channelMessageKeys.create],
    mutationFn: sendAudioMessageService,
    onSuccess: handleSuccessMutation,
  });

  async function handleSuccessMutation() {
    setAudio(null);
    return await queryClient.invalidateQueries({
      queryKey: [channelMessageKeys.listInfinit],
    });
  }

  function getFormaDataPayload() {
    const messagePayload: FormData = new FormData();
    messagePayload.append("date", format(new Date(), "dd/MM/yyyy"));
    messagePayload.append("message_type", "1");
    messagePayload.append("user_id", user!.id.toString());
    messagePayload.append("channel_id", String(channelId));

    if (audio?.blob) {
      const audioFile = new File([audio.blob], `audio-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      messagePayload.append("attachments[]", audioFile);
    }

    return messagePayload;
  }

  function handleSendAudio() {
    if (!user || !channelId) return;

    const messagePayload = getFormaDataPayload();
    sendAudioMessageMutation(messagePayload);
  }

  return {
    state: { isSendingAudioMessage },
    data: {},
    actions: { handleSendAudio },
  };
};
