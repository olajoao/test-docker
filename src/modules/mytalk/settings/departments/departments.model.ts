import { useDepartments } from "./department.hooks";

export const useDepartmentModel = () => {
  const { departmentData, isLoadingDepartments } = useDepartments();

  return {
    state: { isLoadingDepartments },
    data: { departmentData },
    actions: {},
  };
};
