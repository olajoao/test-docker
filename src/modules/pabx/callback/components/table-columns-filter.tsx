import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { useReactTable } from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import type { CallbackProps } from "../model"
import { useEffect } from "react"

const STORAGE_KEY = 'pabx-callback-table-columns';

export function TableColumnsFilter({ table }: { table: ReturnType<typeof useReactTable<CallbackProps>> }) {
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const visibility = JSON.parse(saved) as Record<string, boolean>
        Object.entries(visibility).forEach(([columnId, isVisible]) => {
          const column = table.getColumn(columnId)
          if (column) column.toggleVisibility(isVisible)
        })
      } catch {
        console.warn("Falha ao carregar visibilidade das colunas")
      }
    }
  }, [table])

  const columnVisibility = table.getState().columnVisibility;

  useEffect(() => {
    const subscription = table.getState().columnVisibility
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription))
  }, [columnVisibility])


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="ml-auto text-xs 2xl:text-sm">
          Colunas <ChevronDown />
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
                onCheckedChange={(value) => {
                  column.toggleVisibility(!!value)
                  const current = table.getState().columnVisibility
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
                }
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>

  )
}
