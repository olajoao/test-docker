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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { DialogClose } from "@radix-ui/react-dialog";
import { useWindowSize } from "usehooks-ts";
import { useWidechatModalModel } from "./widechat-modal.model";
import { CircuitBoard } from "lucide-react";

function WidechatIntegrationModal() {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { data, state, actions } = useWidechatModalModel() 

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.toggleModal}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            title="Criar conversa em departamento"
            className="bg-sky-500"
          >
            <UserGroupIcon />
            <span>Sincronizar usuários</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Sincronizar usuários</DialogTitle>
            <DialogDescription>Clique para vincular usuário ao Widechat</DialogDescription>
          </DialogHeader>
          <div className="ring-1 rounded-xl ring-neutral-100 dark:ring-neutral-700 p-5 text-sm flex flex-col gap-y-5 max-h-[75dvh] scrollbar overflow-y-auto">
            {data.users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <span>{user.nome}</span>
                <Button className="w-max" variant="outline">
                  <CircuitBoard className="w-8 h-8" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => actions.toggleModal(false)}
              >
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={state.isOpen} onOpenChange={actions.toggleModal}>
      <DrawerTrigger asChild>
          <Button
            variant="default"
            className="w-10 h-10 rounded-full fixed z-10 bottom-5 right-3"
          >
            <UserGroupIcon />
            <span className="sr-only">Sincronizar usuários</span>
          </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>Sincronizar usuários</DrawerTitle>
        </DrawerHeader>
        <div className="px-5">
        </div>
        <DrawerFooter className="pt-2 grid grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default WidechatIntegrationModal;
