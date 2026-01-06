import { httpClient } from "@/modules/mytalk/api/adapter";
import { departmentEndpoint } from "../../departments.endpoints";

export const createDepartmentService = async (deparment: FormData) =>
  await httpClient.post(departmentEndpoint.default, deparment);

export const editDepartmentService = async (
  departmentId: number,
  deparment: FormData,
) =>
  await httpClient.postWithMethodPut(
    departmentEndpoint.withId(departmentId),
    deparment,
  );
