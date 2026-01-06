import { httpClient } from "@/modules/mytalk/api/adapter";
import { messageEndpoint } from "../../channel.messages.endpoints";
import type { EditMessageProps } from "./edit-message.types";

export const editMessageService = async ({
  messageId,
  newMessage,
}: {
  messageId: number;
  newMessage: EditMessageProps;
}) => {
  return await httpClient.put(
    `${messageEndpoint.default}/${messageId}`,
    newMessage,
  );
};
