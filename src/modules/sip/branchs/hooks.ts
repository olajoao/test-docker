import { useQuery } from "@tanstack/react-query"
import { branchsService } from "@/api/services"
import { Route } from "@/pages/_app/_layout.sip.branchs"

export const useBranchs = () => {
  const { filter } = Route.useSearch()
  console.log("filter: ", filter)

  const listQuery = useQuery({
    queryKey: ["sip-branchs", filter],
    queryFn: () => branchsService.list({ filter }),
  })

  return {
    list: listQuery.data?.slice(0, 10),
    isLoading: listQuery.isPending || listQuery.isLoading,
  }
}

