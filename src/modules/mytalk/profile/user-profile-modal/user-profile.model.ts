import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { userProfileKeys } from "./user-profile.keys";
import { removeProfilePicture, uploadUserProfileAvatar } from "./user-profile.service";
import { queryClient } from "@/lib/react-query";
import { userCacheKey } from "../../users/users.cache-key";
import { toast } from "sonner";
import { userFormSchema, type UserFormSchema } from "./user-profile.schema";
import type { WhoAmIUser } from "../../interfaces/who-am-i";
import { ModalType } from "../../stores/modal";

export const useUserProfileModel = ({ user }: { user: WhoAmIUser }) => {
  const { isOpen, toggleModal } = useModal(ModalType.HandleUserProfileEdit);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const handleImageChange = (file?: File | null) => {
    if (file) {
      form.setValue("avatar", file, { shouldDirty: true });
      const imgUrl = URL.createObjectURL(file);
      setLocalImage(imgUrl);
    } else {
      form.setValue("avatar", null, { shouldDirty: true });
    }
  };

  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      avatar: "",
    },
    values: {
      avatar: user.avatar ? user.avatar : null,
    },
  });

  const { mutateAsync: uploadUserAvatarMutation } =
  useMutation({
    mutationKey: [userProfileKeys.update, user.id],
    mutationFn: async ({ data }: { data: FormData }) =>
      await uploadUserProfileAvatar({ branchId: parseInt(user.id.split("_")[1]), formData: data }),
    onSuccess: () => handleSuccess({ message: "Imagem alterada com sucesso!" }),
    onError: () => toast.error("Erro ao enviar! Arquivo inválido.")
  });

  const { mutateAsync: removeProfilePictureMutation } =
  useMutation({
    mutationKey: [userProfileKeys.deleteImage, user.id],
    mutationFn: async ({ branchId }: { branchId: number }) =>
      await removeProfilePicture({ branchId }),
    onSuccess: () => handleSuccess({ message: "Imagem removida com sucesso!" }),
    onError: () => toast.error("Erro ao remover imagem! Arquivo inválido.")
  });

  async function handleSuccess({ message }: { message: string }) {
    toast.success(message);
    toggleModal(false);
    form.reset();
    setLocalImage(null);
    return await queryClient.invalidateQueries({
      queryKey: [userCacheKey.whoAmI],
    });
  }

  function handleSubmit(data: UserFormSchema) {
    const formData = new FormData();
    if (data.avatar) {
      formData.append("avatar", data.avatar);
      return uploadUserAvatarMutation({ data: formData });
    }
  }

  function handleRemoveImage({ id }: { id: string }) {
    if(!id) return toast.error("Erro ao processar dados! Tente novamente mais tarde.")
    const branchId = parseInt(id.split('_')[1])
    if(!branchId) return toast.error("Erro ao processar dados! Tente novamente mais tarde.")
    return removeProfilePictureMutation({ branchId })
  }

    
  const uploading = useIsMutating({
    mutationKey: [userProfileKeys.update, user.id],
  }) > 0;

  const removing = useIsMutating({
    mutationKey: [userProfileKeys.deleteImage, user.id],
  }) > 0;

  const isPending = uploading || removing;

  return {
    state: { isOpen, isPending, uploading, removing },
    data: { form, localImage },
    actions: { toggleModal, handleSubmit, handleImageChange, handleRemoveImage },
  };
};
