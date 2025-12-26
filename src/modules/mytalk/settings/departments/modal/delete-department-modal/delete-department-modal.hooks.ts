import { useMutation } from "@tanstack/react-query";
import { departmentCacheKey } from "../../department.cache-key";
import { deleteDepartmentService } from "./delete-department-modal.service";
import { queryClient } from "@/lib/react-query";
import { DepartmentProps } from "../../departments.types";

export const useDeleteDepartment = (callback: () => void) => {
  const {
    mutateAsync: deleteDepartmentMutation,
    isPending: isLoadingDeleteDepartment,
  } = useMutation({
    mutationKey: [departmentCacheKey.delete],
    mutationFn: (departmentId: number) =>
      deleteDepartmentService(departmentId),
    onMutate: async (department) => {
      await queryClient.cancelQueries({ queryKey: [departmentCacheKey.list]})
      const previousData = queryClient.getQueryData([departmentCacheKey.list])
      queryClient.setQueryData([departmentCacheKey.list], 
        (old: DepartmentProps[]) => {
          const departmentList = Array.isArray(old) ? old : [];

          return departmentList.filter(
            (dep: DepartmentProps) => dep.id !== department 
          );
        }
      )

      return {
        previousData 
      }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData([departmentCacheKey.list], context?.previousData)
    },
    onSettled: async () => {
      callback()
      return await queryClient.invalidateQueries({
        queryKey: [departmentCacheKey.list],
      })
    } 
  });

  return {
    deleteDepartmentMutation,
    isLoadingDeleteDepartment,
  };
};
