import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useContactUsers } from "@/modules/mytalk/users/users.hooks";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/outline";
import { ChatBubbleIcon, PersonIcon } from "@radix-ui/react-icons";
import { useWindowSize } from "usehooks-ts";
import ChannelGroup from "../channel-group/channel-group";
import { useChannelModalModel } from "./channel-modal.model";

function ChannelModal() {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useChannelModalModel();
  const { contactList, isLoadingContatcs } = useContactUsers();

  if (isDesktop) {
    return (
      <Sheet open={state.isSheetOpen} onOpenChange={actions.setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="w-max justify-start cursor-pointer font-normal"
            title="Criar conversa"
          >
            <ChatBubbleIcon />
            <span className="sr-only">Criar nova conversa</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Nova conversa</SheetTitle>
            <SheetDescription>
              Inicie uma conversa ou crie um novo grupo
            </SheetDescription>
          </SheetHeader>
          <ChannelGroup />
          <div className="flex flex-col overflow-auto max-h-[80dvh]">
            {isLoadingContatcs ? (
              <div className="text-sm text-muted-foreground">
                Carregando contatos...
              </div>
            ) : null}
            {Array.isArray(contactList?.data) && contactList.data.map((contact) => (
              <Button
                key={contact.id}
                variant="ghost"
                className="hover:bg-muted justify-start dark:hover:bg-muted-foreground/20"
                title={contact.nome}
                onClick={() =>
                  actions.handleChannel({
                    targetUserId: contact.id,
                    targetUserName: contact.nome,
                  })
                }
              >
                <PersonIcon />
                <span className="text-sm font-normal truncate">{contact.nome}</span>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={state.isSheetOpen} onOpenChange={actions.setIsSheetOpen}>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          title="Criar conversa"
          className="w-max justify-start text-white font-normal"
        >
          <ChatBubbleBottomCenterIcon />
          <span className="sr-only">Iniciar conversa ou criar conversa</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>Nova conversa</DrawerTitle>
          <DrawerDescription>
            Inicie uma conversa ou crie um novo grupo
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-5 sm:px-0">
          <ChannelGroup />
        </div>
        <div className="flex flex-col overflow-auto max-h-[60dvh] pb-5 sm:pb-0">
          {isLoadingContatcs ? (
            <div className="text-sm text-muted-foreground">
              Carregando contatos...
            </div>
          ) : null}
          {Array.isArray(contactList?.data) && contactList.data.map((contact) => (
            <Button
              key={contact.id}
              variant="ghost"
              className="hover:bg-muted justify-start"
              onClick={() =>
                actions.handleChannel({
                  targetUserId: contact.id,
                  targetUserName: contact.nome,
                })
              }
            >
              <PersonIcon />
              <span className="text-sm font-normal">{contact.nome}</span>
            </Button>
          ))}
        </div>
        <DrawerFooter className="pt-2 sm:grid grid-cols-2 hidden">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
          <Button className="w-full">Criar conversa</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ChannelModal;
