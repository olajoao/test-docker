import { useQuery } from "@tanstack/react-query"
import { Route } from "@/pages/_app/_layout.sip.branchs"
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "./components"
import type { SipBranchProps } from "./model"
import { ENDPOINTS } from "@/shared/endpoints"
import { baseService } from "@/api/services"

export const useBranchs = () => {
  const { filter, page = 1, perPage = 15 } = Route.useSearch()

  const listQuery = useQuery({
    queryKey: [ENDPOINTS.SIP_BRANCHS, filter, page, perPage],
    queryFn: () => baseService.list<SipBranchProps>({ filter, page, per_page: perPage }),
  })
  const table = useReactTable({
    data: listQuery.data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: listQuery.data && listQuery.data.meta ? Math.ceil(listQuery.data.meta.total / perPage) : -1,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: perPage,
      },
    },
  })

  return {
    list: listQuery.data,
    isLoading: listQuery.isPending || listQuery.isLoading,
    table,
  }
}
