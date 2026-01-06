import { ColumnDef } from "@tanstack/react-table";
import { DepartmentProps } from "../departments.types";
import { format } from "date-fns";
import DepartmentModal from "../modal/department-modal/department-modal";
import DeleteDepartmentModal from "../modal/delete-department-modal/delete-department-modal";

export const columns: ColumnDef<DepartmentProps>[] = [
  {
    accessorKey: "name",
    id: "Nome",
    header: "Nome do departamento",
    cell: ({ row }) => <div className="text-xs">{row.original?.name}</div>,
  },
  {
    accessorKey: "description",
    id: "Descrição",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="text-xs">{row.original?.description}</div>
    ),
  },
  {
    accessorKey: "users",
    id: "Membros",
    header: "Membros",
    cell: ({ row }) => {
      const hasOnlyOneUser = row.original?.users?.length === 1;
      const hasMoreThanOneUser = row.original?.users?.length > 1;
      const message = hasOnlyOneUser ? (
        "1 membro"
      ) : hasMoreThanOneUser ? (
        row.original?.users?.length + " membros"
      ) : (
        <span className="text-muted-foreground text-[10px]">Nenhum membro</span>
      );

      return <div className="text-xs">{message}</div>;
    },
  },
  {
    accessorKey: "date",
    id: "Data de criação",
    header: "Data de criação",
    cell: ({ row }) => {
      {
        return row.original?.date ? (
          <div className="text-xs">
            {format(row.original?.date, "dd/MM/yyyy")}
          </div>
        ) : (
          "Não definida"
        );
      }
    },
  },
  {
    header: "Ações",
    id: "Ações",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <DepartmentModal department={row.original} isEdit />
          <DeleteDepartmentModal department={row.original} />
        </div>
      );
    },
  },
];
