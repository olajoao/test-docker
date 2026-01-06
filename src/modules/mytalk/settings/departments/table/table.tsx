import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { DepartmentProps } from "../departments.types";
import { columns } from "./columns";
import { useWindowSize } from "usehooks-ts";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DividerVerticalIcon } from "@radix-ui/react-icons";
import DepartmentModal from "../modal/department-modal/department-modal";
import { LoadingTable } from "@/modules/mytalk/components/loading-table";
import type { Meta } from "@/modules/mytalk/interfaces/reports";

interface DepartmentTableProps {
  departments: DepartmentProps[];
  metaData?: Meta;
  isPending?: boolean
}

export function DepartmentTable({
  departments,
  metaData,
  isPending,
}: DepartmentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const setSearchParams = (update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(window.location.search)
    update(params)
    const next = params.toString()
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname
    window.history.replaceState(null, "", url)
  }

  const [pagination] = useState({
    pageIndex: 0,
    pageSize: metaData?.per_page || 15,
  });

  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  const table = useReactTable({
    data: departments,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  function prevPage() {
    if (metaData && metaData?.current_page > 1) {
      setSearchParams((state) => {
        state.set("page", String(metaData?.current_page - 1));
        return state;
      });
    }
  }

  function nextPage() {
    if (metaData && metaData?.current_page < metaData?.last_page) {
      setSearchParams((state) => {
        state.set("page", String(metaData?.current_page + 1));
        return state;
      });
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-end items-center py-4 gap-x-5">
        <DepartmentModal />
      </div>
      {isPending ? (
        <LoadingTable rows={5} columns={5} />
      ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader className="text-xs">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        </TableHead>
                      );
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
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum departamento encontrado
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="text-xs">
              {isDesktop && "Colunas"} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DividerVerticalIcon className="text-muted" />
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!metaData?.current_page || metaData?.current_page <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={
              !metaData?.current_page ||
                metaData?.current_page >= metaData?.last_page
            }
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
