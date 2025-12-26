import { useNewModal } from "@/hooks/use-modal";
import { queryClient } from "@/lib/react-query";
import { useContactUsers } from "@/modules/mytalk/users/users.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { departmentCacheKey } from "../../department.cache-key";
import { DepartmentProps } from "../../departments.types";
import {
  DepartmentSchema,
  departmentSchema,
  editDepartmentSchema,
} from "./department-modal.schema";
import {
  createDepartmentService,
  editDepartmentService,
} from "./department-modal.service";
import { ModalType } from "@/store/new-modal";

export const useDepartmentModalModel = ({
  department,
}: {
  department?: DepartmentProps;
}) => {
  const { isOpen, toggleModal } = useNewModal(
    department?.id
      ? ModalType.HandleEditDepartment
      : ModalType.HandleDepartment,
    department?.id,
  );

  const { contactList } = useContactUsers();

  const {
    mutateAsync: handleDepartmentMutation,
    isPending: isCreatingDepartment,
  } = useMutation({
    mutationKey: [
      department?.id ? departmentCacheKey.update : departmentCacheKey.create,
    ],
    mutationFn: (data: FormData) =>
      department?.id
        ? editDepartmentService(department.id, data)
        : createDepartmentService(data),
    onSuccess: handleSuccessMutation,
  });

  function getFormDataPayload(data: DepartmentSchema) {
    const formData = new FormData();
    formData.append("name", data.name ?? "");
    formData.append("description", data.description ?? "");
    formData.append("user_ids", data.user_ids?.join(",") ?? "");
    formData.append("date", format(new Date(), "yyyy-MM-dd HH:mm:ss") ?? "");
    return formData;
  }

  function handleSuccessMutation() {
    const message = department?.id
      ? "Departamento atualizado"
      : "Departamento criado";
    toast.success(message + " com sucesso");
    toggleModal(false);
    queryClient.invalidateQueries({ queryKey: [departmentCacheKey.list] });
  }

  const form = useForm<DepartmentSchema>({
    resolver: zodResolver(
      department?.id ? editDepartmentSchema : departmentSchema,
    ),
    defaultValues: {
      name: "",
      description: "",
      user_ids: [],
    },
    values: {
      name: department?.name ?? "",
      description: department?.description ?? "",
      user_ids: department?.users?.length
        ? department?.users.map((user) => user.user_id)
        : [],
    },
  });

  function handleDepartment(data: DepartmentSchema) {
    const payload = getFormDataPayload(data);
    return handleDepartmentMutation(payload);
  }

  return {
    state: { isOpen, isCreatingDepartment },
    data: { form, contactList },
    actions: { toggleModal, handleDepartment },
  };
};
