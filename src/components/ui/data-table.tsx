import {
  type ColumnDef,
  flexRender,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SipBranchProps } from "@/modules/sip/branchs"
import { Button } from "./button"
import { Route } from "@/pages/_app/_layout.sip.branchs"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  table: ReturnType<typeof useReactTable<SipBranchProps>>
}

export function DataTable<TData, TValue>({
  columns,
  table
}: DataTableProps<TData, TValue>) {

  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const handleChangePage = (nextPage: number) => {
    navigate({
      search: {
        ...search,
        page: nextPage,
      },
    })
  }

  const pageIndex = table.getState().pagination.pageIndex + 1
  const pageCount = table.getPageCount()

  return (
    <div className="space-y-5">
      <div className="relative rounded-md border min-w-0 h-[calc(100dvh-335px)] overflow-y-auto space-y-5">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-muted-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="relative">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs 2xl:text-sm"
            onClick={() => handleChangePage(pageIndex - 1)}
            disabled={pageIndex <= 1}
          >
            Anterior
          </Button>

          <span className="text-xs 2xl:text-sm text-muted-foreground">
            Página {pageIndex} de {pageCount > 0 ? pageCount : "?"}
          </span>

          <Button
            variant="outline"
            size="sm"
            className="text-xs 2xl:text-sm"
            onClick={() => handleChangePage(pageIndex + 1)}
            disabled={pageCount > 0 && pageIndex >= pageCount}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
