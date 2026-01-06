import { http } from "@/api/http"
import { useAppToken } from "@/hooks/use-app-token"
import type { ApiResponse, Media } from "./model"

function getRequiredHeaders() {
  const { appToken } = useAppToken() as { appToken?: { server_id?: number; pabx_id?: number } }

  const serverId = appToken?.server_id
  const pabxId = appToken?.pabx_id

  if (!serverId || !pabxId) {
    throw new Error("Missing server/pabx context (server_id/pabx_id)")
  }

  return {
    "X-SERVERX-ID": String(serverId),
    "X-SERVER-PABX-ID": String(pabxId),
  }
}

export type ListMediasParams = {
  filter?: string
  page?: number
  perPage?: number
}

export async function listMedias(params: ListMediasParams) {
  const { filter, page = 1, perPage = 15 } = params

  const response = await http.get<ApiResponse<Media>>("/api/governance/medias", {
    params: {
      filter,
      page,
      per_page: perPage,
    },
    headers: getRequiredHeaders(),
    withCredentials: false,
  })

  return response.data
}

export type UploadMediaParams = {
  file: File
  nome?: string
}

export async function uploadMedia(params: UploadMediaParams) {
  const formData = new FormData()
  formData.append("arquivo", params.file)

  if (params.nome) {
    formData.append("nome", params.nome)
  }

  const response = await http.post("/api/governance/medias", formData, {
    headers: {
      ...getRequiredHeaders(),
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export type UpdateMediaParams = {
  id: string
  nome?: string
  file?: File | null
}

export async function updateMedia(params: UpdateMediaParams) {
  const formData = new FormData()

  if (params.nome) {
    formData.append("nome", params.nome)
  }

  if (params.file) {
    formData.append("arquivo", params.file)
  }

  const response = await http.put(`/api/governance/medias/${params.id}`, formData, {
    headers: {
      ...getRequiredHeaders(),
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export async function deleteMedia(id: string) {
  const response = await http.delete(`/api/governance/medias/${id}`, {
    headers: getRequiredHeaders(),
  })

  return response.data
}
