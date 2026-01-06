import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ChevronDown } from "lucide-react";
import DeleteMessageModal from "./modal/delete-message-modal/delete-message-modal";
import EditMessageModal from "./modal/edit-message-modal/edit-message-modal";
import type { ChannelMessageProps } from "./channel.messages.types";

function MessageOptions({
  message,
  showEditOption = true,
  showDeleteOption = true,
}: {
  message: ChannelMessageProps;
  showEditOption?: boolean;
  showDeleteOption?: boolean;
}) {
  return (
    <Menubar className="z-30 bg-transparent border-none shadow-none top-0 -right-1 absolute sm:invisible sm:group-hover:visible">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </MenubarTrigger>
        <MenubarContent className="flex flex-col">
          {showEditOption ? <EditMessageModal message={message} /> : null}
          {showDeleteOption ? (
            <DeleteMessageModal
              message={{
                ...message,
                message: `${
                  message.attachments?.length
                    ? message.attachments?.length + " arquivos serão excluídos"
                    : message.message
                } `,
              }}
            />
          ) : null}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default MessageOptions;
