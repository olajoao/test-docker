import { httpClient } from "@/modules/mytalk/api/adapter";
import { channelEndpoint } from "./channel.endpoint";
import type { ChannelProps } from "./channel.types";

export const listChannels = async () => {
  const response = await httpClient.get<ChannelProps[]>(
    channelEndpoint.default,
    new URLSearchParams({ per_page: "200" }),
  );

  return response;
};

export const listInfinityChannels = async (params: URLSearchParams) => {
  const response = await httpClient.get<ChannelProps[]>(
    channelEndpoint.default,
    params,
  );

  return response;
};

export const showChannel = async ({
  channelId,
}: {
  channelId: number | string;
}) => {
  const response = await httpClient.getDefault<ChannelProps>(
    `${channelEndpoint.default}/${channelId}`,
  );

  return response;
};
