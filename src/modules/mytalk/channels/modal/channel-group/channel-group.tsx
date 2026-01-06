import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import ChannelGroupForm from "./channel-group.form";
import { useChannelGroupModel } from "./channel-group.model";
import type { ChannelProps } from "../../channel.types";

function ChannelGroup({
  isEdit = false,
  groupChannel,
}: {
    isEdit?: boolean;
    groupChannel?: ChannelProps;
  }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useChannelGroupModel();
  const formId = groupChannel?.id ? "handleEditGroupForm" : "handleGroupForm"

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.toggleModal} modal={true}>
        <DialogTrigger asChild>
          {isEdit ? (
            <Button
              className="px-2 w-full justify-start font-normal"
              title="Editar grupo"
              variant="ghost"
              type="button"
            >
              <Edit2Icon />
              <span>Editar grupo</span>
            </Button>
          ) : (
              <Button
                className="w-full my-5 bg-teal-600"
                title="Criar conversa em grupo"
              >
                <UserGroupIcon />
                <span>Criar grupo</span>
              </Button>
            )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Editar grupo" : "Criar grupo"}</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <ChannelGroupForm groupChannel={groupChannel} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={state.isOpen} onOpenChange={actions.toggleModal}>
      <DrawerTrigger asChild>
        {isEdit ? (
          <Button
            className="px-2 w-full justify-start font-normal"
            title="Editar grupo"
            variant="ghost"
          >
            <Edit2Icon />
            <span>Editar grupo</span>
          </Button>
        ) : (
            <Button
              variant="secondary"
              className="w-full sm:my-5"
              title="Criar conversa em grupo"
            >
              <UserGroupIcon />
              <span>Criar grupo</span>
            </Button>
          )}
      </DrawerTrigger>
      <DrawerContent className="sm:px-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>{isEdit ? "Editar grupo" : "Criar grupo"}</DrawerTitle>
          <DrawerDescription>Selecione no mínimo 3 usuários</DrawerDescription>
        </DrawerHeader>
        <ChannelGroupForm groupChannel={groupChannel} />
        <DrawerFooter className="pt-2 grid grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
          <Button form={formId} type="submit">
            {state.isCreatingChannelGroup ? (
              <Loader2 className="animate-spin" />
            ) : isEdit ? (
                "Editar grupo"
              ) : (
                  "Criar grupo"
                )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ChannelGroup;
