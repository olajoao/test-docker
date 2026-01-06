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
import { useDeleteChannelModel } from "./delete-channel.model";
import { EChannelTypes, type ChannelProps } from "../../channel.types";

function DeleteChannel({ channel }: { channel: ChannelProps }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useDeleteChannelModel({
    channelId: channel.id,
  });

  const isGroup = channel.channel_type === EChannelTypes.GROUP;
  const deleteMessage =
    channel.channel_type === EChannelTypes.GROUP ? "o grupo " : "a conversa";

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="px-2 w-full justify-start text-red-600 dark:text-red-400 font-normal"
            title="Encerrar sessão"
            disabled={!channel?.id}
          >
            <TrashIcon />
            <span>Remover {isGroup ? "grupo" : "conversa"}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Remover {isGroup ? "grupo" : "conversa"}</DialogTitle>
            <DialogDescription>{channel?.name}</DialogDescription>
          </DialogHeader>
          <div className="text-sm">
            Você realmente deseja remover {isGroup ? "o grupo " : "a conversa com "}
            <span className="text-destructive dark:text-red-400">{channel?.name}</span>?
          </div>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={actions.handleDeleteChannel}>
              {state.isLoadingDeleteChannel ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Remover {deleteMessage}</span>
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
          <span>Remover conversa</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>Remover conversa</DrawerTitle>
          <DrawerDescription>{channel?.name}</DrawerDescription>
        </DrawerHeader>
        <div className="text-sm px-5">
          Você tem certeza que deseja o conversa{" "}
          <span className="text-primary">{channel?.name}</span>?
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
            onClick={actions.handleDeleteChannel}
          >
            Remover conversa
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DeleteChannel;
