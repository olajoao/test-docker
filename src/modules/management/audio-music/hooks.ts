import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS } from "@/shared/endpoints"
import { deleteMedia, listMedias, updateMedia, uploadMedia, type UpdateMediaParams, type UploadMediaParams } from "./api"

export const useManagementAudioMusicList = (filter?: string, page: number = 1, perPage: number = 15) => {
  const listQuery = useQuery({
    queryKey: [ENDPOINTS.MANAGEMENT_AUDIOS, { filter, page, perPage }],
    queryFn: () => listMedias({ filter, page, perPage }),
  })

  return {
    data: listQuery.data,
    isLoading: listQuery.isPending || listQuery.isLoading,
    query: listQuery,
  }
}

export const useUploadManagementAudioMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UploadMediaParams) => uploadMedia(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ENDPOINTS.MANAGEMENT_AUDIOS] })
    },
  })
}

export const useUpdateManagementAudioMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateMediaParams) => updateMedia(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ENDPOINTS.MANAGEMENT_AUDIOS] })
    },
  })
}

export const useDeleteManagementAudioMusic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ENDPOINTS.MANAGEMENT_AUDIOS] })
    },
  })
}
