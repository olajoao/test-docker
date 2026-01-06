export const channelEndpoint = {
  default: "my_talk_channels",
  storeOrReturnChannel: "my_talk_channels/storeOrReturnChannel",
  withChannelId: (channelId: number) => `my_talk_channels/${channelId}`,
};
