import { ChatEditor } from "@/modules/mytalk/chat/chat-editor";
import { Uploaders } from "./uploaders/uploaders";
import { UserMic } from "./user-mic";

export function ChatFooter({ isService = false }: { isService: boolean }) {
  return (
    <footer
      className="max-h-28 border-t border-muted-foreground/20 flex items-center p-3 sm:p-5 bg-muted-foreground/5 flex-1"
      id="editorWrapper"
    >
      <div className="w-full flex gap-x-3 sm:gap-x-5 items-end">
        <Uploaders />
        <ChatEditor isService={isService} />
        <UserMic />
      </div>
    </footer>
  );
}
