import { queryClient } from "@/lib/react-query";
import { channelKeys } from "../channels/channel.keys";
import { channelMessageKeys } from "../channels/messages/channel.messages.keys";
import { listInfinityMessages } from "../channels/messages/channel.messages.service";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useChannelInfinityMessages = ({
  channelId,
}: {
  channelId: string;
}) => {
  const {
    status,
    data: infinityMessages = { pages: [] },
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: [channelMessageKeys.listInfinit, channelId],
    queryFn: (ctx) => {
      const pageParam = ctx.pageParam ?? 1;
      return listInfinityMessages(
        new URLSearchParams({
          per_page: "30",
          page: pageParam.toString(),
          channel_id: channelId,
        }),
      );
    },
    initialData: () => {
      const channelData = queryClient.getQueryData([channelKeys.list]);
      if (Array.isArray(channelData)) {
        return channelData.find((channel) => channel.id === channelId);
      }
      return undefined;
    },
    getNextPageParam: (lastGroup) => {
      if (lastGroup?.meta) {
        const { current_page, last_page } = lastGroup?.meta;
        if (current_page && last_page) {
          return current_page < last_page ? current_page + 1 : undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    refetchInterval: 3000,
    retry: false,
    staleTime: 60 * 1000,
    enabled: !!channelId,
  });

  return {
    status,
    data: infinityMessages,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    isPending,
    hasNextPage: hasNextPage ?? false,
  };
};
