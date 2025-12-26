import { httpClient } from "@/modules/mytalk/api/adapter";
import type { UserApiProps, WebUserApiProps } from "./users.types";

export const listUsers = async () =>
  await httpClient.get<UserApiProps[]>("my_talk_channel_members");

export const listContacts = async () =>
  await httpClient.get<WebUserApiProps[]>(
    "my_talk_users",
    new URLSearchParams({ per_page: "500" }),
  );
