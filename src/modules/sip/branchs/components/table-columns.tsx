import type { ColumnDef } from "@tanstack/react-table"
import type { SipBranchProps } from "../model"

export const columns: ColumnDef<SipBranchProps>[] = [
  {
    accessorKey: "name",
    id: "Ramal",
    header: "Ramal",
  },
  {
    accessorKey: "gravar",
    header: "Gravação",
    cell: ({ row }) => {
      return (
        <span className={row.getValue('gravar') ? 'text-green-600' : 'text-muted-foreground'}>
          {row.getValue('gravar') ? 'Tem gravação' : 'Não tem gravação'}
        </span>
      )
    }
  },
  {
    accessorKey: "callerid",
    id: 'Título',
    header: "Nome",
  },
  {
    accessorKey: "ramal_virtual",
    header: "Conta SIP",
  },
  {
    accessorKey: "rota_saida",
    header: "Regra de saída",
  },
  {
    accessorKey: "secret",
    header: "Senha",
  },
  {
    accessorKey: "dod",
    header: "ACL",
  },
  {
    accessorKey: "callgroup",
    header: "Grupo",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "ip",
    header: "IP",
  },
]
