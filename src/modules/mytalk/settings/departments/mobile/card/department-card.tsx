import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { format } from "date-fns";
import { DepartmentProps } from "../../departments.types";
import DepartmentModal from "../../modal/department-modal/department-modal";
import DeleteDepartmentModal from "../../modal/delete-department-modal/delete-department-modal";

interface DepartmentCardProps {
  department: DepartmentProps;
}

function DepartmentCard({ department }: DepartmentCardProps) {
  const hasOnlyOneUser = department.users.length === 1;
  const hasMoreThanOneUser = department.users.length > 1;
  const membersMessage = hasOnlyOneUser ? (
    "1 membro"
  ) : hasMoreThanOneUser ? (
    department.users.length + " membros"
  ) : (
    <span className="text-muted-foreground text-[10px]">Nenhum membro</span>
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card>
          <CardHeader>
            <CardTitle>{department.name}</CardTitle>
            <CardDescription className="max-w-96 truncate">
              {department.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2">
            <p className="flex flex-col gap-y-1">
              <span className="text-xs text-muted-foreground">
                Data de criação
              </span>
              <span className="text-sm">
                {format(department.date, "dd/MM/yyyy")}
              </span>
            </p>
            <p className="flex flex-col gap-y-1">
              <span className="text-xs text-muted-foreground">Membros</span>
              <span className="text-sm">{membersMessage}</span>
            </p>
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="sm:space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>{department.name}</DrawerTitle>
          <DrawerDescription>{department.description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-y-3 pb-5 items-start">
          <DepartmentModal department={department} isEdit />
          <DeleteDepartmentModal department={department} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default DepartmentCard;
