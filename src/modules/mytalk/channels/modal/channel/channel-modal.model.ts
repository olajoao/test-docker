import { getIdFromResponseHeadersLocation } from "@/helpers/get-response-header-id";
import { queryClient } from "@/lib/react-query";
import { useSheetStore } from "@/store/sheet";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import { channelKeys } from "../../channel.keys";
import { EChannelTypes } from "../../channel.types";
import { createChannelService } from "./channel-modal.service";
import { useWhoAmIUserContext } from "@/modules/mytalk/stores/who-am-i-user";

export const useChannelModalModel = () => {
  const { user } = useWhoAmIUserContext();
  const navigate = useNavigate();
  const { isSheetOpen, setIsSheetOpen } = useSheetStore();

  const {
    mutateAsync: createChannelMutation,
    isPending: isLoadingCreateChannel,
  } = useMutation({
    mutationKey: [channelKeys.create],
    mutationFn: async (newChannel: FormData) =>
      await createChannelService({ newChannel }),
    onSuccess: async (response: any) => {
      const location = response.headers.location;
      const channelId = parseInt(getIdFromResponseHeadersLocation(location));
      await handleSuccess();
      return navigate({ to: `/mytalk/${channelId}` });
    },
  });

  function createFormDataPayload({
    targetUserId,
    targetUserName,
  }: {
    targetUserId: string;
    targetUserName: string;
  }) {
    const formData = new FormData();
    formData.append("creator_id", user?.id.toString() ?? "");
    formData.append("name", targetUserName ?? "");
    formData.append("channel_type", EChannelTypes.PRIVATE.toString());
    formData.append(
      "members_id",
      [user?.id.toString() ?? "", targetUserId.toString()].toString(),
    );
    formData.append("date", format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    return formData;
  }

  async function handleSuccess() {
    setIsSheetOpen(false);
    return await queryClient.invalidateQueries({
      queryKey: [channelKeys.list],
    });
  }

  async function handleChannel({
    targetUserId,
    targetUserName,
  }: {
    targetUserId: string;
    targetUserName: string;
  }) {
    if (!user?.id) return;
    const payload: FormData = createFormDataPayload({
      targetUserId,
      targetUserName,
    });
    return await createChannelMutation(payload);
  }

  return {
    state: { isSheetOpen, isLoadingCreateChannel },
    data: {},
    actions: { setIsSheetOpen, handleChannel },
  };
};
