import { getIdFromResponseHeadersLocation } from "@/helpers/get-response-header-id";
import { useModal } from "@/hooks/use-modal";
import { queryClient } from "@/lib/react-query";
import { useContactUsers } from "@/modules/mytalk/users/users.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { channelCacheKey } from "../../channel.cache-key";
import {
  createGroupFormSchema,
  editGroupFormSchema,
  type EditGroupFormSchema,
} from "./channel-group.schema";
import {
  createChannelGroupService,
  editChannelGroupService,
} from "./channel-group.service";
import { channelKeys } from "../../channel.keys";
import type { ChannelProps } from "../../channel.types";
import { useWhoAmIUserContext } from "@/modules/mytalk/stores/who-am-i-user";
import { ModalType } from "@/modules/mytalk/stores/modal";
import { useSheetStore } from "@/modules/mytalk/stores/sheet";

export const useChannelGroupModel = (groupChannel?: ChannelProps) => {
  const navigate = useNavigate();
  const { user } = useWhoAmIUserContext();
  const { isOpen, toggleModal } = useModal(
    groupChannel?.id
      ? ModalType.HandleEditChannelGroup
      : ModalType.HandleChannelGroup,
  );
  const { isSheetOpen, setIsSheetOpen } = useSheetStore();
  const { contactList } = useContactUsers();

  const hasDataToMute =
    !!contactList?.data?.length && !!groupChannel?.members?.length;

  const permissions: string[] | undefined = hasDataToMute
    ? contactList?.data
    .filter((contact) =>
      groupChannel?.members?.some(
        (member) => member?.webUser?.id === contact?.id,
      ),
    )
    .map((checkedContact) => checkedContact?.id)
    : undefined;

  const cache_key = groupChannel?.id ? channelCacheKey.update : channelCacheKey.create;

  const channelGroupForm = useForm<EditGroupFormSchema>({
    resolver: zodResolver(
      groupChannel?.id ? editGroupFormSchema : createGroupFormSchema,
    ),
    defaultValues: {
      name: groupChannel?.name ?? '',
      description: groupChannel?.description ?? '',
      channel_image: groupChannel?.channel_image ?? "",
      members: permissions?.length ? permissions : [],
    },
  });

  const name = channelGroupForm.watch("name");
  const description = channelGroupForm.watch("description");
  const members = channelGroupForm.watch("members");
  const channel_image = channelGroupForm.watch("channel_image");

  const {
    mutateAsync: handleChannelGroupFn,
    isPending: isCreatingChannelGroup,
  } = useMutation({
    mutationKey: [cache_key],
    mutationFn: (data: FormData) => {
      return groupChannel?.id
        ? editChannelGroupService(groupChannel.id, data)
        : createChannelGroupService(data)
    }
    ,
    onSuccess: async (response: any) => {
      const location = response.headers.location;
      const channelId = parseInt(getIdFromResponseHeadersLocation(location));
      await handleMutateSuccess();
      return navigate({ to: `/mytalk/${channelId}` });
    },
  });

  async function handleMutateSuccess() {
    await queryClient.invalidateQueries({ queryKey: [channelCacheKey.list] });
    await queryClient.invalidateQueries({ queryKey: [channelKeys.show] });

    if (groupChannel?.id) {
      toast.success("Grupo editado com sucesso!");
    }

    toggleModal(false);
    if (isSheetOpen) {
      setIsSheetOpen(false);
    }
  }

  function getChannelGroupFormDataPayload(data: EditGroupFormSchema) {
    if (data.members?.length && user?.id) {
      data.members.unshift(user.id);
    }

    const formData = new FormData();
    formData.append("name", data.name ?? "");
    formData.append("description", data.description ?? "");
    // formData.append("channel_image", data.channel_image ?? "");
    formData.append("members_id", data.members?.join(",") ?? "");
    formData.append("creator_id", user?.id.toString() ?? "");
    formData.append("channel_type", "1");
    formData.append("date", format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    return formData;
  }

  function handleCreateChannelGroup(data: EditGroupFormSchema) {
    const payload: FormData = getChannelGroupFormDataPayload(data);
    return handleChannelGroupFn(payload);
  }

  return {
    state: {
      isOpen,
      isCreatingChannelGroup,
    },
    data: {
      channelGroupForm,
      contactList,
      name,
      description,
      members,
      channel_image,
    },
    actions: { toggleModal, handleCreateChannelGroup },
  };
};
