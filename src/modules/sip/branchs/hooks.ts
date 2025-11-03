import { useQuery } from "@tanstack/react-query"
import { branchsService } from "@/api/services"
import { Route } from "@/pages/_app/_layout.sip.branchs"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "./components"
import type { SipBranchProps } from "./model"

export const useBranchs = () => {
  const { filter } = Route.useSearch()

  const listQuery = useQuery({
    queryKey: ["sip-branchs", filter],
    queryFn: () => branchsService.list<SipBranchProps[]>({ filter }),
  })

  const table = useReactTable({
    data: listQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return {
    list: listQuery.data,
    isLoading: listQuery.isPending || listQuery.isLoading,
    table,
  }
}
