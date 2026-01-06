import { httpClient } from "@/modules/mytalk/api/adapter";
import { channelEndpoint } from "../../channel.endpoint";

export const deleteChannelService = async (channelId: number) => {
  const response = await httpClient.delete(
    `${channelEndpoint.withChannelId(channelId)}`,
  );

  return response;
};
