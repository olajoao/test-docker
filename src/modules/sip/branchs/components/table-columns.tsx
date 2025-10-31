import type { ColumnDef } from "@tanstack/react-table"
import type { SipBranchProps } from "../model"

export const columns: ColumnDef<SipBranchProps>[] = [
  {
    accessorKey: "id",
    header: "Ramal",
  },
  {
    accessorKey: "completed",
    header: "Gravação",
    cell: ({ row }) => {
      return (
        <span className={row.getValue('completed') ? 'text-green-600' : 'text-muted-foreground'}>
          {row.getValue('completed') ? 'Tem gravação' : 'Não tem gravação'}
        </span>
      )
    }
  },
  {
    accessorKey: "title",
    header: "Nome",
  },
  {
    accessorKey: "userId",
    header: "Conta SIP",
  },
  {
    accessorKey: "",
    header: "Regra de saída",
  },
  {
    accessorKey: "",
    header: "Senha",
  },
  {
    accessorKey: "",
    header: "ACL",
  },
  {
    accessorKey: "",
    header: "Grupo",
  },
  {
    accessorKey: "",
    header: "Status",
  },
  {
    accessorKey: "",
    header: "IP",
  },
]
