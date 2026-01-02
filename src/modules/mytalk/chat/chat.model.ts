import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useModal } from "@/hooks/use-modal";
import { ModalType } from "@/store/modal";
import { ClassicEditor } from "ckeditor5";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { channelMessageKeys } from "../channels/messages/channel.messages.keys";
import { editorConfig } from "./chat.config";
import { editMessageService, sendMessageService } from "./chat.service";
import { useScrollMessageListStore } from "@/store/scroll-message-list";
import { toast } from "sonner";
import type { MessagePayloadProps } from "./chat.types";
import { useMyTalkChannelId } from "../hooks/use-current-channel-id";
import { useWhoAmIUserContext } from "../stores/who-am-i-user";

const ENTER_KEY_CODE = 13;

export const useChatModel = ({
  message,
  messageId,
  isService = false,
}: {
    message?: string;
    messageId?: number;
    isService?: boolean;
  }) => {
  const { isOpen, toggleModal } = useModal(ModalType.HandleEditMessage);
  const channelId = useMyTalkChannelId();
  const queryClient = useQueryClient();
  const { user } = useWhoAmIUserContext();
  const { setScroll } = useScrollMessageListStore()

  const channelIdRef = useRef(channelId);
  const isServiceRef = useRef<boolean>(isService);
  const editorContainerRef = useRef(null);
  const userRef = useRef(user?.id);

  const editorRef = useRef<ClassicEditor | null>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const isEdit = isOpen && !!message?.trim();

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  useEffect(() => {
    if (user?.id) {
      userRef.current = user.id;
    }
  }, [user]);

  useEffect(() => {
    channelIdRef.current = channelId
  }, [channelId])

  const { mutateAsync: sendMessageMutation, isPending: isSendingMessage } =
  useMutation({
    mutationKey: [channelMessageKeys.create],
    mutationFn: isEdit ? editMessageService : sendMessageService,
    onSuccess: handleSuccessMutation,
    onError: handleMutationError,
  });

  function clearAndFocusEditor() {
    editorRef.current?.setData("");
    editorRef.current?.focus();
  }

  async function handleSuccessMutation() {
    toggleModal(false);
    setScroll(true)

    return await queryClient.invalidateQueries({
      queryKey: [channelMessageKeys.listInfinit],
    });
  }

  function handleMutationError() {
    toast.error('Erro ao enviar mensagem.');
  }

  async function handleSendMessage(message: MessagePayloadProps) {
    return await sendMessageMutation(message);
  }

  async function handleSendChatMessage() {
    const editorData = editorRef.current?.getData();
    const userId = userRef.current!;

    if (!editorData) return editorRef.current?.focus();

    const payload: MessagePayloadProps = {
      id: messageId,
      channel_id: channelIdRef.current,
      user_id: userId,
      message: editorData,
      message_type: isServiceRef.current ? 2 : 0,
      date: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
    };

    clearAndFocusEditor();

    if (isEdit) {
      payload.edited = 1;
    }

    return await handleSendMessage(payload);
  }

  const handleEditorReady = (editor: ClassicEditor) => {
    editorRef.current = editor;

    if (isEdit) {
      editorRef.current.setData(message!);
    }

    editorRef.current?.editing.view.document.on("keydown", async (_, data) => {
      if (data.keyCode === ENTER_KEY_CODE) {
        if (data.shiftKey) return;
        data.preventDefault();
        setScroll(true)
        await handleSendChatMessage();
        setScroll(false);
      }
    });
  };

  return {
    state: { isLayoutReady, isSendingMessage },
    data: {
      editorConfig,
      editorContainerRef,
      isServiceRef,
      editorRef,
      channelIdRef,
      channelId,
      ClassicEditor,
      user,
    },
    actions: { handleSendMessage, handleEditorReady },
  };
};
