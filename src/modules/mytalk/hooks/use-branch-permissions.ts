import { cacheKey } from "@/shared/cache-key";
import { endpoints } from "@/shared/endpoint";
import { useQuery } from "@tanstack/react-query";
import { useAppToken } from "@/hooks/use-app-token";
import { httpClient } from "../api/adapter";

interface BranchPermissions {
  allow_mytalk: boolean;
  allow_webrtc: boolean;
  should_logout: boolean;
}

const REFRESH_INTERVAL = 2 * 60 * 1000;

export const useBranchPermissions = () => {
  const { appToken } = useAppToken();

  const canFetch = Boolean(appToken?.sip_rwp && appToken?.base_url);

  const fallbackPermissions: any | undefined = appToken
    ? {
        allow_mytalk: Boolean(appToken.allow_mytalk),
        allow_webrtc: Boolean(appToken.allow_webrtc),
      }
    : undefined;

  const params = appToken?.sip_rwp
    ? new URLSearchParams({ p: appToken.sip_rwp })
    : undefined;

  const {
    data: permissions,
    error,
    isFetching,
    isPending,
  } = useQuery<BranchPermissions>({
    queryKey: [cacheKey.mytalk.branchPermissions, appToken?.sip_rwp],
    enabled: canFetch,
    staleTime: REFRESH_INTERVAL,
    refetchInterval: REFRESH_INTERVAL,
    retry: 1,
    queryFn: async () => {
      if (!params) {
        throw new Error("Missing sip_rwp param");
      }

      return httpClient.getDefault<BranchPermissions>(
        endpoints.mytalk.branchPermissions,
        params,
      );
    },
  });

  const finalPermissions =
    permissions ?? (error || !canFetch ? fallbackPermissions : undefined);

  return {
    permissions: finalPermissions,
    isLoadingBranchPermissions: canFetch && (isPending || isFetching),
    error,
  };
};
