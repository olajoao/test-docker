import { httpClient } from "@/modules/mytalk/api/adapter";
import { messageEndpoint } from "../../channel.messages.endpoints";

export const deleteMessageService = async (messageId: number) =>
  await httpClient.delete(messageEndpoint.delete(messageId));
