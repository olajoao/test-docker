import { ChatFooter } from "@/components/mytalk/chat-footer";
import { ChatHeader } from "@/components/mytalk/chat-header";
import { ShowImageModal } from "@/components/preview-files/preview-files-modal";
import { EmptyChat } from "../../empty";
import { useChannel } from "../channel.hooks";
import MessageList from "./message-list";
import { EChannelTypes } from "../channel.types";

export function MessageView({ channelId }: { channelId?: string }) {
  const { channel } = useChannel({
    channelId: channelId ?? "",
  });

  if (!channelId) {
    return <EmptyChat />;
  }

  return (
    <div className="flex flex-col h-full min-h-dvh flex-1 justify-between max-h-dvh overflow-y-clip">
      <ChatHeader channel={channel} />
      <MessageList channelId={channelId ?? ""} />
      <ChatFooter isService={channel?.channel_type === EChannelTypes.SERVICE} />
      <ShowImageModal />
    </div>
  );
}
