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
    accessorKey: "completed",
    header: "Regra de saída",
  },
  {
    accessorKey: "userId",
    header: "Senha",
  },
  {
    accessorKey: "userId",
    header: "ACL",
  },
  {
    accessorKey: "userId",
    header: "Grupo",
  },
  {
    accessorKey: "userId",
    header: "Status",
  },
  {
    accessorKey: "userId",
    header: "IP",
  },
]
