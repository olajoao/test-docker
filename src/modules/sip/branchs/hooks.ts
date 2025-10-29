import { branchsService } from "@/api/services";
import { useQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router";

export const useBranchs = () => {
  const route = getRouteApi('/_app/sip/branchs')
  const params = route.useSearch()

  const listQuery = useQuery({
    queryKey: ['sip-branchs'],
    queryFn: () => branchsService.list(params)
  })

  return {
    list: listQuery.data
  }
}
