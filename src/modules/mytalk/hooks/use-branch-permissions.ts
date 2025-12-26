import { cacheKey } from "@/shared/cache-key";
import { endpoints } from "@/shared/endpoint";
import { useQuery } from "@tanstack/react-query";
import { useAppToken } from "@/hooks/use-app-token";
import request from "@/modules/mytalk/request";

interface BranchPermissionsProps {
  allow_mytalk: boolean
  allow_webrtc: boolean
  should_logout: boolean
}

const MINUTES_TO_REFETCH = 2 * 60 * 1000;

export const useBranchPermissions = () => {
  const { appToken } = useAppToken()

  const fallbackPermissions: BranchPermissionsProps | undefined = appToken
    ? {
        allow_mytalk:
          Number((appToken as any).allow_mytalk ?? 0) === 1 ||
          appToken.settings?.view_mytalk === true,
        allow_webrtc: Number((appToken as any).allow_webrtc ?? 0) === 1,
        should_logout: false,
      }
    : undefined

  const params = new URLSearchParams()
  if(appToken?.sip_rwp) {
    params.set('p', appToken?.sip_rwp ?? '')
  }

  const canFetchBranchPermissions = Boolean(appToken?.sip_rwp && appToken?.base_url)

  const {
    data: permissions,
    isFetching,
    isPending,
    error,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: [cacheKey.mytalk.branchPermissions, appToken?.sip_rwp ?? null],
    enabled: canFetchBranchPermissions,
    queryFn: async () => {
      if (!appToken?.base_url) {
        throw new Error("Missing app_token.base_url for MyTalk request")
      }

      const response = await request.get<BranchPermissionsProps>(
        endpoints.mytalk.branchPermissions,
        { params },
      )

      const data = response.data as unknown
      if (typeof data === "string" && /<!doctype\s+html/i.test(data)) {
        throw new Error("MyTalk branchPermissions returned HTML (wrong baseURL)")
      }

      return data as BranchPermissionsProps
    },
    staleTime: MINUTES_TO_REFETCH,
    refetchInterval: MINUTES_TO_REFETCH,
  });

  console.log('[mytalk][useBranchPermissions]', {
    canFetchBranchPermissions,
    sip_rwp: appToken?.sip_rwp,
    endpoint: endpoints.mytalk.branchPermissions,
    status,
    fetchStatus,
    hasPermissionsFromApi: Boolean(permissions),
    permissions,
    fallbackPermissions,
    error,
  })

  return {
    permissions: permissions ?? fallbackPermissions,
    isLoadingBranchPermissions: canFetchBranchPermissions
      ? isPending || isFetching
      : false,
    error,
  };
};
