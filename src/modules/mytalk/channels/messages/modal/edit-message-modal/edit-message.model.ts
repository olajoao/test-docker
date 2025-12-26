import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { channelMessageKeys } from "../../channel.messages.keys";
import { editMessageService } from "./edit-message.service";
import { useModal } from "@/hooks/use-modal";
import { ModalType } from "@/store/modal";
import { editMessageSchema, type EditMessageSchema } from "./edit-message.schema";
import type { EditMessageProps } from "./edit-message.types";

export const useEditMessageModel = ({
  messageId,
  message,
}: {
  messageId: number;
  message: string;
}) => {
  const { isOpen, toggleModal } = useModal(ModalType.HandleEditMessage);

  const form = useForm<EditMessageSchema>({
    resolver: zodResolver(editMessageSchema),
    defaultValues: {
      message: "",
      date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      edited: 1,
    },
    values: {
      message,
    },
  });

  const { mutateAsync: editMessageMutation, isPending: isEditingMessage } =
    useMutation({
      mutationKey: [channelMessageKeys.update],
      mutationFn: ({ newMessage }: { newMessage: EditMessageProps }) =>
        editMessageService({ messageId, newMessage }),
    });

  function handleEditMessage(message: EditMessageSchema) {
    return editMessageMutation({ newMessage: message });
  }

  return {
    state: {
      isOpen,
      isEditingMessage,
    },
    data: { form },
    actions: {
      toggleModal,
      handleEditMessage,
    },
  };
};
