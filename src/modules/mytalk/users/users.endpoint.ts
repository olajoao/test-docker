export const channelEndpoint = {
  default: "my_talk_channels",
  withChannelId: (channelId: number) => `my_talk_channels/${channelId}`,
};
