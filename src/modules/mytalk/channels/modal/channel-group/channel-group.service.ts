import { httpClient } from "@/modules/mytalk/api/adapter";
import { channelEndpoint } from "../../channel.endpoint";

export const createChannelGroupService = async (channelGroup: FormData) =>
  await httpClient.post(channelEndpoint.storeOrReturnChannel, channelGroup);

export const editChannelGroupService = async (
  channelId: number,
  channelGroup: FormData,
) =>
  await httpClient.postWithMethodPut(
    `${channelEndpoint.withChannelId(channelId)}`,
    channelGroup,
  );
