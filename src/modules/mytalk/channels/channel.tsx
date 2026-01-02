import logoWideChatIntelbras from "@/assets/intelbras.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 
import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "@tanstack/react-router";
import ChannelGroup from "./modal/channel-group/channel-group";
import DeleteChannel from "./modal/delete-channel/delete-channel";
import { useEffect, useState } from "react";
import { EChannelTypes, type ChannelProps } from "./channel.types";
import type { WebUserApiProps } from "../users/users.types";
import { useWhoAmIUserContext } from "../stores/who-am-i-user";

export type Message = {
  id: string;
  username: string;
  group: string;
  profilePicture: string;
  from: string;
  hour: string;
};

export function Channel({ channel }: { channel: ChannelProps }) {
  const [storageUsers, setStorageUsers] = useState<WebUserApiProps[]>([])
  const { user } = useWhoAmIUserContext();
  const contact = channel?.members?.find(
    (member) => member?.webUser?.id !== user?.id,
  );

  const contactUser = storageUsers.find((webUser: WebUserApiProps) => webUser.id === contact?.webUser.id)

  const linkUrl = `/mytalk/${channel?.id}`;

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

  if (!user?.id || !channel.id) {
    return null;
  }

  return (
    <div className="flex items-center relative hover:bg-neutral-400/10 dark:hover:bg-neutral-100/10 cursor-pointer h-14 py-3 pl-5">
      <Link
        to={linkUrl}
        className="absolute inset-0 flex items-center pl-5"
        activeProps={{
          className: "absolute inset-0 flex items-center pl-5 bg-neutral-100/10 ring-1 ring-neutral-100/20",
        }}
      >
        <div className="flex items-center gap-x-2">
          {isGroup ? (
            <div className="h-8 w-8 justify-center flex items-center rounded-full border border-neutral-400/10 dark:border-neutral-100/10">
              <UserGroupIcon className="w-5 h-5 text-sky-500" />
            </div>
          ) : null}

          {isPrivate && contactUser?.avatar ? (
            <img
              src={contactUser?.avatar}
              alt="Imagen de perfil da conversa"
              className="flex overflow-clip h-8 w-8 rounded-full border border-neutral-400/10 dark:border-neutral-100/10"
              title={contactUser?.nome}
              loading="lazy"
            />
          ) : null}

          {(isPrivate && !contactUser?.avatar) || isService ? (
            <div className="h-8 w-8 justify-center flex items-center rounded-full border border-neutral-400/10 dark:border-neutral-100/10">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          ) : null}

          <div className="flex flex-col" title={channel?.name}>
            <div className="flex items-start gap-x-2">
              {isPrivate ? (
                <p className="text-xs font-medium max-w-28 truncate">
                  {contact?.webUser?.name || "Não identificado"}
                </p>
              ) : null}

              {isGroup ? (
                <p className="text-xs font-medium max-w-28 truncate">
                  {channel?.name || "Não identificado"}
                </p>
              ) : null}

              {isService ? (
                <p
                  className="text-xs font-medium max-w-28 truncate"
                  title={channel?.name}
                >
                  {channel?.name.split("-")[1]}
                </p>
              ) : null}

              {isService ? (
                <img
                  src={logoWideChatIntelbras}
                  alt="Widechat Logo"
                  className="w-3 h-3"
                  width="12"
                  height="12"
                />
              ) : null }
            </div>
            <small className="text-[10px] text-muted-foreground w-24 truncate">
              {channel?.description}
            </small>
          </div>
        </div>
      </Link>

      <div className="flex z-0 absolute right-3 py-3">
        <div className="place-content-center flex-1">
          <small className="text-[9px] text-muted-foreground block min-w-max">
            {channel?.last_message?.created_at
              ? formatDistanceToNowStrict(channel.last_message.created_at, {
                locale: ptBR,
                addSuffix: true,
              })
              : null}
          </small>
        </div>

        <DropdownMenu modal={true}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-transparent border-none hover:bg-neutral-300 dark:text-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 p-0"
            >
              <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" aria-modal="true">
            {isGroup ? <ChannelGroup groupChannel={channel} isEdit /> : null}
            <DeleteChannel channel={channel}></DeleteChannel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
