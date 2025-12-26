import { httpClient } from "@/modules/mytalk/api/adapter";
import { departmentEndpoint } from "../../departments.endpoints";

export const deleteDepartmentService = async (messageId: number) =>
  await httpClient.delete(`${departmentEndpoint.withId(messageId)}`);
