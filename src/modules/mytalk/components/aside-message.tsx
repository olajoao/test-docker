import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Link, useRouterState } from "@tanstack/react-router";
import { FacebookIcon } from "../icons/FacebookIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { MoveIcon } from "../icons/MoveIcon";
import { WhatsAppIcon } from "../icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import DeleteChannel from "@/modules/mytalk/channels/modal/delete-channel/delete-channel";
import type { ChannelProps } from "../channels/channel.types";

export type Message = {
  id: string;
  username: string;
  group: string;
  profilePicture: string;
  from: string;
  hour: string;
};

export function AsideMessage({
  id,
  from,
  group,
  hour,
  profilePicture,
  username,
}: Message) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isActive = pathname.includes(id);
  const linkUrl = `/mytalk/${id}`;

  return (
    <li
      className={`py-3 hover:bg-neutral-100/10 cursor-pointer ${
        isActive ? "bg-neutral-100/10 ring-1 ring-neutral-100/20" : ""
      }`}
    >
      <Link to={linkUrl} className="flex items-center gap-x-3 pl-5">
        <img
          src={profilePicture}
          alt=""
          className="h-8 w-8 rounded-full border border-neutral-100/10"
        />
        <div className="flex flex-col" title={username}>
          <div className="flex gap-x-1">
            <p className="text-xs font-medium max-w-24 text-white truncate">
              {username}
            </p>
            {from === "whatsapp" && <WhatsAppIcon className="w-3.5 h-3.5" />}
            {from === "facebook" && <FacebookIcon className="w-3.5 h-3.5" />}
            {from === "instagram" && <InstagramIcon className="w-3.5 h-3.5" />}
            {!from && null}
          </div>
          <small className="text-[10px] text-neutral-300">{group}</small>
        </div>
        <small className="text-[9px] text-neutral-300 block ml-auto">
          {hour}
        </small>
        <Menubar className="p-0 pr-3 bg-transparent border-none">
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="px-1 hover:bg-neutral-300 text-neutral-200"
              >
                <DotsVerticalIcon className="w-5 h-5" />
              </Button>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger className="flex gap-x-2">
                  <MoveIcon className="w-5 h-5" />
                  <span>Mover</span>
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Financeiro</MenubarItem>
                  <MenubarItem>Administrativo</MenubarItem>
                  <MenubarItem>Comercial</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <DeleteChannel channel={{} as ChannelProps} />
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Link>
    </li>
  );
}
