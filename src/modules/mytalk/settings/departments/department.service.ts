import { httpClient } from "@/modules/mytalk/api/adapter";
import { departmentEndpoint } from "./departments.endpoints";
import { DepartmentProps } from "./departments.types";

export const listDepartments = async ({ params }: { params?: URLSearchParams }) =>
  await httpClient.get<DepartmentProps[]>(departmentEndpoint.default, params);
