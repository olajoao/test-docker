import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { TrashIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { DepartmentProps } from "../../departments.types";
import { useDeleteDepartmentModel } from "./delete-department-modal.model";

function DeleteDepartmentModal({
  department,
}: {
  department: DepartmentProps;
}) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useDeleteDepartmentModel();

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="px-2 font-normal text-destructive"
            title="Remover departamento"
          >
            <TrashIcon />
            <span className="sr-only">Remover departamento</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Remover departamento</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="text-xs max-h-[50dvh] overflow-auto">
            Tem certeza que deseja remover o departamento{" "}
            <span className="text-destructive">{department.name}</span>?
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => actions.handleDeleteDepartment(department.id)}
            >
              {state.isLoadingDeleteDepartment ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Remover"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={state.isOpen} onOpenChange={actions.setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          title="Remover conversa"
          className="text-red-600 px-5 w-full justify-start font-normal"
        >
          <TrashIcon className="" />
          <span>Remover departamento</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>Remover departamento</DrawerTitle>
          <DrawerDescription>{department.name}</DrawerDescription>
        </DrawerHeader>
        <div className="text-xs max-h-[50dvh] overflow-auto px-5">
          Tem certeza que deseja remover o departamento{" "}
          <span className="text-destructive">{department.name}</span>?
        </div>
        <DrawerFooter className="pt-2 grid grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => actions.handleDeleteDepartment(department.id)}
          >
            Remover
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DeleteDepartmentModal;
