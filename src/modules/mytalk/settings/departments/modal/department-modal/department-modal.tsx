import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Edit2Icon, Loader2 } from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { DepartmentProps } from "../../departments.types";
import DepartmentModalForm from "./department-modal.form";
import { useDepartmentModalModel } from "./department-modal.model";

function DepartmentModal({
  isEdit = false,
  department,
}: {
  isEdit?: boolean;
  department?: DepartmentProps;
}) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useDepartmentModalModel({ department });

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.toggleModal}>
        <DialogTrigger asChild>
          {isEdit ? (
            <Button
              className="px-2 w-max"
              title="Editar departamento"
              size="sm"
              variant="ghost"
            >
              <Edit2Icon />
              <span className="sr-only">Editar departamento</span>
            </Button>
          ) : (
            <Button
              size="sm"
              title="Criar conversa em departamento"
              className="bg-teal-600"
            >
              <UserGroupIcon />
              <span>Criar departamento</span>
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Editar departamento" : "Criar departamento"}
            </DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <DepartmentModalForm department={department} />
          <DialogFooter className="mt-5">
            <Button
              variant="outline"
              onClick={() => actions.toggleModal(false)}
            >
              Fechar
            </Button>

            <Button form="handleDepartmentForm" type="submit">
              {state.isCreatingDepartment ? (
                <Loader2 className="animate-spin" />
              ) : isEdit ? (
                "Editar departamento"
              ) : (
                "Criar departamento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={state.isOpen} onOpenChange={actions.toggleModal}>
      <DrawerTrigger asChild>
        {isEdit ? (
          <Button
            className="px-5 w-full justify-start font-normal"
            title="Editar departamento"
            variant="ghost"
          >
            <Edit2Icon />
            <span>Editar departamento</span>
          </Button>
        ) : (
          <Button
            variant="default"
            className="w-10 h-10 rounded-full fixed z-10 bottom-5 right-3"
          >
            <UserGroupIcon />
            <span className="sr-only">Botão criar departamento</span>
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {isEdit ? "Editar departamento" : "Criar departamento"}
          </DrawerTitle>
          <DrawerDescription>Selecione no mínimo 3 usuários</DrawerDescription>
        </DrawerHeader>
        <div className="px-5">
          <DepartmentModalForm department={department} />
        </div>
        <DrawerFooter className="pt-2 grid grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
          <Button form="handleDepartmentForm" type="submit">
            {state.isCreatingDepartment ? (
              <Loader2 className="animate-spin" />
            ) : isEdit ? (
              "Editar departamento"
            ) : (
              "Criar departamento"
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DepartmentModal;
