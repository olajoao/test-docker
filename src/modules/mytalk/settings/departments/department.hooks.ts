import { useQuery } from "@tanstack/react-query";
import { departmentCacheKey } from "./department.cache-key";
import { listDepartments } from "./department.service";

export const useDepartments = () => {
  const searhParams = new URLSearchParams(window.location.search)
  const page = searhParams.get("page")

  const { data: departmentData, isPending: isLoadingDepartments } = useQuery({
    queryKey: [departmentCacheKey.list, page],
    queryFn: () => listDepartments({ params: searhParams }),
  });

  return {
    departmentData,
    isLoadingDepartments,
  };
};
