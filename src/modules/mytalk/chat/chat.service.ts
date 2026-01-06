import { httpClient } from "@/modules/mytalk/api/adapter";
import { messageEndpoint } from "../channels/messages/channel.messages.endpoints";
import type { MessagePayloadProps } from "./chat.types";

export const sendMessageService = async (message: MessagePayloadProps) =>
  await httpClient.post(messageEndpoint.default, message);

export const editMessageService = async (message: MessagePayloadProps) =>
  await httpClient.put(`${messageEndpoint.default}/${message.id}`, message);

export const sendImageMessageService = async (message: FormData) =>
  await httpClient.post(messageEndpoint.default, message);

export const sendAudioMessageService = async (message: FormData) =>
  await httpClient.post(messageEndpoint.default, message);
