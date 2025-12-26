import { httpClient } from "@/modules/mytalk/api/adapter";
import { channelEndpoint } from "../../channel.endpoint";

export const createChannelService = async ({
  newChannel,
}: {
  newChannel: FormData;
}) => {
  return await httpClient.post(
    channelEndpoint.storeOrReturnChannel,
    newChannel,
  );
};
