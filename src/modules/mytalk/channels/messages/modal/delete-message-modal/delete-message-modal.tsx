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
import { useDeleteMessageModel } from "./delete-message.model";
import type { ChannelMessageProps } from "../../channel.messages.types";

function DeleteMessageModal({ message }: { message: ChannelMessageProps }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useDeleteMessageModel();

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="px-2 font-normal text-destructive dark:text-red-400"
            title="Remover mensagem"
            onClick={(e) => e.stopPropagation()}
          >
            <TrashIcon />
            <span>Remover mensagem</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Remover mensagem</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          {message.message ? (
            <div
              className="text-xs max-h-[50dvh] overflow-auto"
              dangerouslySetInnerHTML={{ __html: message.message }}
            ></div>
          ) : null}

          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => actions.handleDeleteMessage(message.id)}
            >
              {state.isLoadingDeleteMessage ? (
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
          size="sm"
          variant="ghost"
          title="Remover conversa"
          className="text-red-600 w-full justify-start"
        >
          <TrashIcon className="" />
          <span>Remover mensagem</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>Remover conversa</DrawerTitle>
          <DrawerDescription>{message.message}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2 grid grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => actions.handleDeleteMessage(message.id)}
          >
            Remover 
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DeleteMessageModal;
