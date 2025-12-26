import { useWhoAmIUserContext } from "@/context/who-am-i-user";

import { UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ResetIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { EChannelTypes, type ChannelProps } from "../channels/channel.types";
import type { WebUserApiProps } from "../users/users.types";

export function ChatHeader({ channel }: { channel?: ChannelProps }) {
 const [storageUsers, setStorageUsers] = useState<WebUserApiProps[]>([])
  const { user } = useWhoAmIUserContext();
  const contact = channel?.members?.find(
    (member) => member.webUser?.id !== user?.id,
  );

  const contactUser = storageUsers.find((webUser: WebUserApiProps) => webUser.id === contact?.webUser.id)

  const channelMembersNames = channel?.members?.map(
    (member) => member.webUser?.name,
  );

  const isGroup = channel?.channel_type === EChannelTypes.GROUP;
  const isPrivate = channel?.channel_type === EChannelTypes.PRIVATE;
  const isService = channel?.channel_type === EChannelTypes.SERVICE;

  useEffect(() => {
    const interval = setInterval(() => {
    const usersStorage = JSON.parse(localStorage.getItem('users') ?? '[]') 
      if (usersStorage.length) {
        setStorageUsers(usersStorage)
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [])

  return (
    <header className="p-3 sm:p-5 h-full max-h-[68px] flex items-center justify-between">
      <div className="flex items-center gap-x-3">
        {isGroup ? (
          <div className="h-8 w-8 justify-center flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <UserGroupIcon className="w-5 h-5 text-sky-500" />
          </div>
        ) : null}
        {isPrivate && !isGroup ? (
          contactUser?.avatar ? (
            <img
              src={contactUser?.avatar}
              alt="Imagen de perfil da conversa"
              className="flex overflow-clip h-8 w-8 rounded-full border border-neutral-100/10"
              title={contactUser?.nome}
              loading="lazy"
            />

          ) : (
              <div className="h-8 w-8 justify-center flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            )
        ) : null 
        }

        {isService && !isPrivate ? (
          <div className="h-8 w-8 justify-center flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
            <UserIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        ) : null}

        <div className="flex flex-col">
          {!channel?.name && !contact?.webUser?.name ? (
            <Skeleton className="w-20 h-2 bg-muted" />
          ) : (
              <p className="text-xs font-medium dark:text-white flex items-center gap-x-2">
                {isPrivate ? contact?.webUser?.name : null}

                {isGroup ? channel.name : null}

                {isService ? channel?.name.split("-")[1] : null}
              </p>
            )}
          {channelMembersNames && isGroup ? (
            <small
              title={channelMembersNames.join(", ")}
              className="text-muted-foreground text-[10px] max-w-52 truncate"
            >
              {channelMembersNames.join(", ")}
            </small>
          ) : null}
        </div>
      </div>
      <div className="items-center gap-x-5 hidden">
        <form className="hidden sm:block">
          <Button disabled size="sm" variant="ghost" className="font-normal">
            <CheckIcon className="w-5 h-5 mr-1" />
            Finalizar atendimento
          </Button>
        </form>
      </div>
      <Link
        to="/mytalk"
        className="sm:hidden flex items-center gap-x-2 text-xs ring-1 ring-muted-foreground/20 rounded px-2.5 py-1.5"
      >
        <ResetIcon />
        Voltar
      </Link>
    </header>
  );
}
