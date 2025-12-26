import { useQuery } from "@tanstack/react-query";
import { channelKeys } from "./channel.keys";
import { listChannels, showChannel } from "./channel.service";

export const useChannels = () => {
  const { data: channels, isPending: isLoadingChannels } = useQuery({
    queryKey: [channelKeys.list],
    queryFn: listChannels,
    refetchInterval: 4000,
    retry: false,
  });

  return {
    channels,
    isLoadingChannels,
  };
};

export const useChannel = ({ channelId }: { channelId: number | string }) => {
  const { data: channel, isPending: isLoadingChannel } = useQuery({
    queryKey: [channelKeys.show, channelId],
    queryFn: () => showChannel({ channelId }),
    enabled: !!channelId,
  });

  return {
    channel,
    isLoadingChannel,
  };
};
