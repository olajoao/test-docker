import { Skeleton } from "@/components/ui/skeleton";
import { useMutationState } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { channelMessageKeys } from "./channel.messages.keys";
import { useImageAndVideoStore } from "@/store/image-n-video-store";
import MessageSkeleton from "../../chat/message-skeleton";
import { useScrollMessageListStore } from "@/store/scroll-message-list";
import type { ChannelMessageProps } from "./channel.messages.types";
import { useChannelInfinityMessages } from "../../hooks/use-infinity-messages";
import { DragAndDrop } from "../../components/drag-and-drop/drag-and-drop";
import { useWhoAmIUserContext } from "../../stores/who-am-i-user";

const LazyMessage = lazy(() => import("../../chat/message"));

const STICKY_THRESHOLD = 64; // px de tolerância para considerar "no fundo"

function MessageList({ channelId }: { channelId: string }) {
  const { isPendingWhoAmIUser } = useWhoAmIUserContext();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChannelInfinityMessages({ channelId });
  const { upload } = useImageAndVideoStore();
  const { scroll } = useScrollMessageListStore()

  const allMessages = data?.pages?.flatMap((d) => d.data).reverse() ?? [];

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // Estado de "grudar no fundo" controlado por scroll do usuário
  const stickToBottomRef = useRef(true);

  const variables = useMutationState<ChannelMessageProps>({
    filters: { mutationKey: [channelMessageKeys.create], status: "pending" },
    select: (mutation) => mutation.state.variables as ChannelMessageProps,
  });

  const calcAtBottom = () => {
    const c = containerRef.current;
    if (!c) return true;
    const atBottom =
      c.scrollTop + c.clientHeight >= c.scrollHeight - STICKY_THRESHOLD;
    return atBottom;
  };

  const scrollToBottom = (smooth = true) => {
    // Usa anchor para evitar jitter com itens altos
    requestAnimationFrame(() => {
      scrollAnchorRef.current?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    });
  };

  useLayoutEffect(() => {
    stickToBottomRef.current = true;
    scrollToBottom(false);
  }, [channelId]);

  // Listener de scroll do usuário -> atualiza sticky
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    const onScroll = () => {
      stickToBottomRef.current = calcAtBottom();
    };

    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, []);

  // Chegada de novas mensagens (recebidas) -> scroll se usuário está no fundo
  useLayoutEffect(() => {
    if (stickToBottomRef.current) {
      scrollToBottom(true);
    }
  }, [allMessages.length]);

  // Envio de mensagens (pendentes) -> também rola se usuário está no fundo
  useLayoutEffect(() => {
    if (scroll || (stickToBottomRef.current && variables.length > 0)) {
      scrollToBottom(true);
    }
  }, [variables.length, scroll]);

  // Mensagens que expandem depois (texto grande, images, lazy/Suspense)
  // Observa o último item e re-roda scroll se ele crescer
  useEffect(() => {
    const el = lastMessageRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      if (stickToBottomRef.current) {
        scrollToBottom(false);
      }
    });
    ro.observe(el);

    // se houver imagens dentro da última mensagem
    const imgs = Array.from(el.querySelectorAll("img"));
    const onLoad = () => {
      if (stickToBottomRef.current) scrollToBottom(false);
    };
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onLoad, { once: true });
    });

    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", onLoad));
    };
  }, [allMessages.length, variables.length]);

  const handleFilesDropped = (files: FileList) => upload(files);

  if (isPendingWhoAmIUser) return <MessageSkeleton />;

  return (
    <DragAndDrop
      onFilesDropped={handleFilesDropped}
      className="flex-1 flex flex-col max-h-[calc(100dvh-180px)]"
    >
      <div
        ref={containerRef}
        className="border-t border-muted-foreground/20 p-3 sm:p-5 flex-1 min-h-full flex flex-col gap-y-3 overflow-y-auto scrollbar"
        style={{ height: "750px", width: "100%" }}
      >
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-muted-foreground text-xs"
          >
            {isFetchingNextPage ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              "Carregar mensagens anteriores"
            )}
          </button>
        )}

        {status === "error" ? (
          <span className="text-xs text-muted-foreground block text-center">
            Erro ao carregar mensagens
          </span>
        ) : (
          allMessages.map((message, index) => {
            const isLastMessage = index === allMessages.length - 1;
            const previousMessage = allMessages[index - 1];
            const isSameUserAsPrevious =
              index > 0 && previousMessage?.user_id === message.user_id;

            return (
              <Suspense
                key={message.id}
                fallback={
                  <Skeleton className="w-40 min-h-6 animate-pulse bg-muted rounded-lg" />
                }
              >
                <LazyMessage
                  message={message}
                  showUserName={!isSameUserAsPrevious}
                  ref={isLastMessage ? lastMessageRef : null}
                />
              </Suspense>
            );
          })
        )}

        {variables.length > 0 &&
          variables.map((variable, index) => {
            const isLastMessage = index === variables.length - 1;
            const previousMessage = allMessages[index - 1];
            const isSameUser =
              index > 0 && previousMessage?.user_id === variable.user_id;

            return (
              <Suspense
                key={variable.user_id + index}
                fallback={
                  <Skeleton className="w-40 min-h-6 animate-pulse bg-muted rounded-lg" />
                }
              >
                <div className="opacity-30 animate-pulse flex gap-x-3 items-center">
                  <LazyMessage
                    message={variable}
                    showUserName={!isSameUser}
                    ref={isLastMessage ? lastMessageRef : null}
                  />
                  <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                </div>
              </Suspense>
            );
          })}
        <div ref={scrollAnchorRef} />
      </div>
    </DragAndDrop>
  );
}

export default MessageList;

