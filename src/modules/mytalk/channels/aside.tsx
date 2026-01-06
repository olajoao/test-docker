import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "@tanstack/react-router";
import { Channel } from "./channel";
import { useChannels } from "./channel.hooks";
import ChannelModal from "./modal/channel/channel-modal";
import { ExitIcon } from "@radix-ui/react-icons";
import { useLogout } from "@/hooks/use-logout";
import UserProfileModal from "../profile/user-profile-modal/user-profile";
import { useWhoAmIUserContext } from "../stores/who-am-i-user";

type MyTalkProps = {
  groupTitle?: string;
};

export function Aside({ groupTitle = "MyTalk" }: MyTalkProps) {
  const { user } = useWhoAmIUserContext();
  const { channels, isLoadingChannels } = useChannels();
  const { logout } = useLogout()

  return (
    <aside className="z-40 sm:flex sm:sticky sm:left-0 sm:inset-y-0 w-full sm:min-w-[300px] bg-sidebar sm:max-w-[300px] min-h-screen h-screen flex-col sm:border-r">
      <div className="sticky top-0 flex flex-col max-h-full overflow-clip">
        <header className="h-max flex items-center justify-between pr-1">
          <Link to="/mytalk">
            <h1 className="text-xl font-bold p-5 dark:text-inherit">
              {groupTitle}
            </h1>
          </Link>
          <ChannelModal />
        </header>
        <div className="h-max flex items-center justify-between border-y border-muted-foreground/20 p-5">
          <div className="flex items-center gap-x-3">
            {user && <UserProfileModal user={user} />}

            <div className="flex flex-col">
              <p
                title={user?.nome}
                className="text-xs font-medium w-40 truncate"
              >
                {user?.nome}
              </p>
              <small
                title={user?.department?.name}
                className="text-[10px] text-neutral-400 w-40 truncate"
              >
                {user?.department?.name}
              </small>
            </div>
          </div>
          <ThemeToggle />
        </div>
        {isLoadingChannels ? (
          <div className="p-5 flex flex-col  gap-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg flex items-center gap-x-3 pl-5 py-3 bg-gray-100/10"
              >
                <div className="h-8 w-8 rounded-full animate-pulse bg-gray-200/30"></div>
                <div className="flex flex-col gap-y-1">
                  <span className="w-32 animate-pulse rounded-md h-4 bg-gray-200/30"></span>
                  <span className="w-10 animate-pulse rounded-md h-4 bg-gray-200/30"></span>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoadingChannels && channels?.data?.length ? (
          <div className="max-h-[calc(100dvh-150px)] h-full overflow-y-auto scrollbar pb-5">
            {channels?.data?.map((channel) => (
              <Channel key={channel?.id} channel={channel} />
            ))}
          </div>
        ) : null}

        {!isLoadingChannels && !channels?.data?.length ? (
          <span className="text-muted-foreground text-xs mx-auto py-10">
            Nenhuma conversa encontrada
          </span>
        ) : null}
      </div>

      <button onClick={logout} className="px-2 cursor-pointer hover:bg-muted-foreground/50 py-2 transition-all duration-200 mx-3 flex items-center gap-x-3 text-sm mt-auto mb-5 rounded-md">
        <ExitIcon className="w-5 h-5" />
        Sair
      </button>
    </aside>
  );
}
