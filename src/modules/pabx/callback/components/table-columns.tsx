import type { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import type { CallbackProps } from "../model"

export const columns: ColumnDef<CallbackProps>[] = [
  {
    accessorKey: "callback",
    id: "Callback",
    header: "Callback",
  },
  {
    accessorKey: "name",
    id: 'Nome',
    header: "Nome",
  },
  {
    accessorKey: "sip_trunk",
    id: "SIP Trunck",
    header: "SIP Trunck",
  },
  {
    accessorKey: "exit_rule",
    id: "Regra de saída",
    header: "Regra de saída",
  },
  {
    accessorKey: "name",
    header: "",
    cell: ({ row }) => {
      return (
        <Trash className="w-4 h-4 text-red-600 cursor-pointer" onClick={() => { console.log(row)}} />
      )
    }
  }
]
