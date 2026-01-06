import { httpClient } from "@/modules/mytalk/api/adapter";
import { messageEndpoint } from "./channel.messages.endpoints";
import type { ChannelMessageProps } from "./channel.messages.types";

export const listMessages = async ({
  channelId,
}: {
  channelId: number | string;
}) => {
  const response = httpClient.get<ChannelMessageProps[]>(
    messageEndpoint.default,
    new URLSearchParams({
      channel_id: channelId.toString(),
      per_page: "200",
    }),
  );

  return response;
};

export const listInfinityMessages = async (params: URLSearchParams) => {
  const response = await httpClient.get<ChannelMessageProps[]>(
    messageEndpoint.default,
    params,
  );

  return response;
};
