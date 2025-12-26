import { httpClient } from "@/modules/mytalk/api/adapter";
import { httpClientCommon } from "@/modules/mytalk/api/commom-adapter";
import { userProfileAvatarEndpoint } from "../endpoints";

export const uploadUserProfileAvatar = async ({
  branchId,
  formData,
}: {
  branchId: number;
  formData: FormData;
}) => await httpClient.post(userProfileAvatarEndpoint.withId(branchId), formData);


export const removeProfilePicture = async ({
  branchId,
}: {
  branchId: number;
}) => await httpClientCommon.delete(userProfileAvatarEndpoint.withId(branchId));
