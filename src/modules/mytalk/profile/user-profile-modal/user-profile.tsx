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
import { PersonIcon } from "@radix-ui/react-icons";
import { Loader2, Trash2 } from "lucide-react";
import { Suspense } from "react";
import { useWindowSize } from "usehooks-ts";
import UserProfileForm from "./user-profile.form";
import { useUserProfileModel } from "./user-profile.model";
import type { WhoAmIUser } from "../../interfaces/who-am-i";

function UserProfileModal({ user }: { user: WhoAmIUser }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const { state, actions } = useUserProfileModel({ user });

  if (isDesktop) {
    return (
      <Dialog open={state.isOpen} onOpenChange={actions.toggleModal}>
        <DialogTrigger asChild>
          <Button
            className="text-white  h-10 w-10 p-0 overflow-clip rounded-full border border-neutral-600 flex items-center justify-center bg-stone-900"
            title="Alterar foto do usuário"
            variant="ghost"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                width={50}
                height={50}
                className="w-full object-cover"
              />
            ) : (
                <PersonIcon className="w-full h-full text-neutral-500" />
              )}
            <span className="sr-only">Editar usuário</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <Suspense fallback={<Loader2 className="animate-spin" />}>
            <UserProfileForm user={user} />
            {user.avatar ? (
              <Button
                onClick={() => actions.handleRemoveImage({ id: user?.id })}
                size="sm"
                variant="ghost"
                className="text-destructive w-max mx-auto disabled:text-mutedforeground"
                type="button"
                disabled={!user.avatar || state.isPending}
              >
                <Trash2 />
                {state.removing ? 'Removendo...' : 'Remover imagem'}
              </Button>
            ) : null }
          </Suspense>
          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => actions.toggleModal(false)}
            >
              Fechar
            </Button>

            <Button
              className="disabled:pointer-events-none disabled:bg-muted-foreground"
              form="handleUserProfileForm"
              type="submit"
              disabled={state.isPending}
            >
              {state.uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : "Salvar imagem"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={state.isOpen} onOpenChange={actions.toggleModal}>
      <DrawerTrigger asChild>
        <Button
          className="text-white h-10 w-10 p-2 rounded-full border border-muted-foreground flex items-center justify-center bg-stone-900"
          title="Alterar foto do usuário"
          variant="ghost"
        >
          <PersonIcon />
          <span className="sr-only">Editar usuário</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="space-y-5">
        <DrawerHeader className="text-left">
          <DrawerTitle>Criar usuário</DrawerTitle>
          <DrawerDescription>Selecione no mínimo 3 usuários</DrawerDescription>
        </DrawerHeader>
        <UserProfileForm user={user} />
        <DrawerFooter className="pt-2 grid grid-cols-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
          <Button
            form="handleGroupForm"
            type="submit"
            disabled={state.isPending}
          >
            {state.uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : "Salvar imagem"}

          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default UserProfileModal;
