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
import { ChatEditor } from "@/modules/mytalk/chat/chat-editor";
import { Edit2Icon } from "lucide-react";
import { useWindowSize } from "usehooks-ts";
import { useEditMessageModel } from "./edit-message.model";
import type { ChannelMessageProps } from "../../channel.messages.types";

function EditMessageModal({ message }: { message: ChannelMessageProps }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useEditMessageModel({
    messageId: message.id,
    message: message.message,
  });

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.toggleModal}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="px-2 font-normal text-left justify-start"
            title="editar mensagem"
          >
            <Edit2Icon />
            <span>Editar mensagem</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Editar mensagem</DialogTitle>
            <DialogDescription className="text-xs flex flex-col">
              <span>Enter: enviar mensagem</span>
              <span>Shift+Enter: nova linha</span>
            </DialogDescription>
          </DialogHeader>
          <section className="bg-muted p-2 rounded-lg">
            <ChatEditor message={message.message} messageId={message.id} />
          </section>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
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
          size="sm"
          variant="ghost"
          className="px-2 font-normal justify-start"
          title="editar mensagem"
        >
          <Edit2Icon />
          <span>Editar mensagem</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>Editar mensagem</DrawerTitle>
          <DrawerDescription className="hidden invisible">
            descrição da mensagem
          </DrawerDescription>
        </DrawerHeader>

        <section className="px-5">
          <div className="bg-muted p-2 rounded-lg">
            <ChatEditor message={message.message} messageId={message.id} />
          </div>
        </section>
        <DrawerFooter className="pt-2 sm:grid sm:grid-cols-2">
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

export default EditMessageModal;
