export const messageEndpoint = {
  default: "my_talk_messages",
  delete: (messageId: number) => `my_talk_messages/${messageId}`,
};
