import AuthenticatedFile from "@/components/autheticated-file";
import { Button } from "@/components/ui/button";
import { handleDownload } from "@/helpers/download-image";
import { FileIcon } from "@radix-ui/react-icons";
import { format, isToday } from "date-fns";
import { forwardRef, Suspense } from "react";
import { Fragment } from "react/jsx-runtime";
import MessageOptions from "../channels/messages/message-options";
import type { ChannelMessageProps } from "../channels/messages/channel.messages.types";
import FullImageFooter from "../components/full-image/full-image-footer";
import FullImage from "../components/full-image/full-image";
import { useWhoAmIUserContext } from "../stores/who-am-i-user";

function defineFileType(fileType: string): string {
  const imagesArray = [
    "png",
    "jpg",
    "svg",
    "webp",
    "jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/jpeg",
  ];
  const videosArray = ["mp4", "mov", "avi", "mkv"];
  const audiosArray = ["mp3", "wav", "ogg", "webm"];
  const documentsArray = ["pdf", "csv", "xlsx", "doc"];

  if (imagesArray.includes(fileType)) return "img";
  if (videosArray.includes(fileType)) return "video";
  if (audiosArray.includes(fileType)) return "audio";
  if (documentsArray.includes(fileType)) return "doc";
  return "other";
}

function showMessageDate(date: Date): string {
  if (isToday(date)) {
    return format(date, "HH:mm");
  }

  return format(date, "dd/MM/yyyy HH:mm");
}

const Message = forwardRef<
  HTMLDivElement,
  { message: ChannelMessageProps; showUserName: boolean }
>(({ message, showUserName }, ref) => {
  const { user } = useWhoAmIUserContext();
  const isDeletedMessage = message.deleted_at;
  const isWidechatMessage = message.message?.includes("Atendente virtual");

  if (isDeletedMessage) {
    return (
      <div
        ref={ref}
        className={`w-max flex rounded-md px-1.5 py-1 items-center bg-muted ${
          message.user_id === user?.id ? "ml-auto " : ""
        }`}
      >
        <span className="text-xs text-muted-foreground">Mensagem apagada</span>
      </div>
    );
  }

  return (
    <article
      ref={ref}
      className={`relative group pb-5 pr-10 w-max h-max p-3 ring-1 min-w-[75px] ring-muted-foreground/20  
            ${
              message.user_id === user?.id || isWidechatMessage
                ? "ml-auto rounded-s-xl rounded-br-xl"
                : "rounded-e-xl rounded-bl-xl"
            }`}
    >
      {showUserName && (
        <h1 className="flex items-center gap-x-2 max-w-44 truncate" title={message?.webUser?.name}>
          <span
            className={`font-medium text-sm truncate ${
              message.user_id === user?.id
                ? "text-amber-500"
                : "text-indigo-400"
            }`}
          >
            {message?.webUser?.name}
          </span>
        </h1>
      )}

      {message.attachments && message.attachments.length > 0 ? (
        <Suspense
          fallback={
            <div className="text-xs text-muted text-center">
              carregando arquivo
            </div>
          }
        >
          <div
            ref={ref}
            className={`group max-w-72 sm:max-w-96 2xl:max-w-full flex flex-wrap gap-5 rounded-md py-1 items-center ${
              message.user_id === user?.id ? "ml-auto " : ""
            }`}
          >
            {message.user_id === user?.id && (
              <MessageOptions message={message} showEditOption={false} />
            )}

            {message?.attachments.map((file) => (
              <Fragment key={file.id}>
                {defineFileType(file.file_type) === "doc" && (
                  <div
                    title={file.file_name}
                    className="rounded-lg overflow-clip cursor-pointer truncate"
                    onClick={() =>
                      handleDownload(
                        file.file_url,
                        file.file_type,
                        file.file_name,
                      )
                    }
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-col text-start justify-center h-full"
                    >
                      <FileIcon className="text-destructive" />
                      <span className="uppercase">{file.file_type}</span>
                      <span className="text-xs truncate w-40">
                        {file.file_name}
                      </span>
                    </Button>
                  </div>
                )}

                {defineFileType(file.file_type) === "audio" && (
                  <div
                    title={file.file_name}
                    className="p-1 m-0 rounded-lg overflow-clip cursor-pointer truncate"
                  >
                    <AuthenticatedFile
                      src={file.file_url}
                      alt={file.file_url}
                      duration={file.audio_duration ?? 0}
                      fileType={defineFileType(file.file_type)}
                    />
                  </div>
                )}

                {defineFileType(file.file_type) === "video" && (
                  <div
                    className="h-max m-0 rounded-lg overflow-clip hover:bg-muted-foreground/20 cursor-pointer"
                    onClick={() =>
                      handleDownload(
                        file.file_url,
                        file.file_type,
                        file.file_name,
                      )
                    }
                  >
                    <AuthenticatedFile
                      src={file.file_url}
                      className="w-52 h-full"
                      alt={file.file_url}
                      fileType={defineFileType(file.file_type)}
                    />
                  </div>
                )}

                {defineFileType(file.file_type) === "img" && (
                  <FullImage url={file.file_url} description={file.file_name}>
                    <FullImageFooter
                      url={file.file_url}
                      type={file.file_type}
                      description={file.file_name}
                    />
                  </FullImage>
                )}
              </Fragment>
            ))}
          </div>
        </Suspense>
      ) : (
        <>
          {message.user_id === user?.id && <MessageOptions message={message} />}
          <div
            className="text-xs break-words max-w-72 xl:max-w-md text-wrap"
            dangerouslySetInnerHTML={{ __html: message.message }}
          ></div>
        </>
      )}

      <span className="text-[8px] text-muted-foreground absolute right-1.5 bottom-1 w-max">
        {message.created_at ? showMessageDate(message.created_at) : ""}
      </span>

      {message.updated_at && (
        <span className="text-[9px] text-muted-foreground/50 absolute right-1.5 top-0">
          editada
        </span>
      )}
    </article>
  );
});

export default Message;
