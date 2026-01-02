import { httpClient } from "@/modules/mytalk/api/adapter";
import { userCacheKey } from "../users/users.cache-key";
import { useQuery } from "@tanstack/react-query";
import { useAppToken } from "@/hooks/use-app-token";
import type { WhoAmIUser } from "../interfaces/who-am-i";

export const useWhoAmI = () => {
  const { appToken } = useAppToken()
  const userId = appToken?.user;

  const { data: user, isFetching, isPending } = useQuery({
    queryKey: [userCacheKey.whoAmI],
    queryFn: async () =>
      await httpClient.getDefault<WhoAmIUser>("my_talk_users/whoami"),
    retry: false,
  });

  return { user, userId, isLoadingWhoAmIUser: isPending || isFetching };
};

export const useGetWhoAmI = ({
  userId,
  shouldFetch = false,
}: {
  userId?: number;
  shouldFetch?: boolean;
}) => {
  const { data: contactUser } = useQuery({
    queryKey: [userCacheKey.getWhoAmI, userId],
    queryFn: async () => {
      if (!userId) throw new Error("ID do usuário não fornecido");

      const response = await httpClient.getDefault<WhoAmIUser>(
        "my_talk_users/whoami",
        new URLSearchParams({
          user: userId.toString(),
        }),
      );

      if (response && response.id && response.avatar) {
        localStorage.setItem(
          `contact_${response.id}`,
          JSON.stringify(response),
        );
      }

      return response;
    },
    enabled: shouldFetch,
    retry: false,
  });

  return { contactUser };
};
