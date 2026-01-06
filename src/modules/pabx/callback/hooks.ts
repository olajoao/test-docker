import { useQuery } from "@tanstack/react-query"
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "./components"
import type { CallbackProps } from "./model"
import { ENDPOINTS } from "@/shared/endpoints"
import { baseServiceCallback } from "@/api/services"
import { Route } from "@/pages/_app/_layout.pabx.callback"

export const useCallback = () => {
  const { filter, page = 1, perPage = 15 } = Route.useSearch()

  const listQuery = useQuery({
    queryKey: [ENDPOINTS.PABX_CALLBACKS, filter, page, perPage],
    queryFn: () => baseServiceCallback.list<CallbackProps>({ filter, page, per_page: perPage }),
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
