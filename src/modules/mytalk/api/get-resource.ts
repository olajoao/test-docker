
import request from "@/modules/mytalk/request";
import type { AxiosResponse } from "axios";
import type { DefaultTypedApiResponse, SearchParamsProps } from "../interfaces/reports";

function readAppTokenPayload(): Record<string, any> {
  const token = localStorage.getItem("app_token");
  if (!token) return {};

  try {
    return JSON.parse(atob(token));
  } catch {
    return {};
  }
}

export async function getResource(
  url: string,
  params?: SearchParamsProps,
  perPage = 20,
) {
  const authPayload = readAppTokenPayload();

  const server_id = authPayload?.server_id ?? null;
  const pabx_id = authPayload?.pabx_id ?? null;

  if (server_id && pabx_id) {
    const response = await request.get(
      `/api/server/${server_id}/pabx/${pabx_id}/${url}?per_page=${perPage}`,
      { params },
    );

    return response;
  }

  return { data: [] };
}

export async function getTypedResource<T>(
  url: string,
  params?: any,
  perPage = 20,
): Promise<AxiosResponse<DefaultTypedApiResponse<T>, any>> {
  const authPayload = readAppTokenPayload();

  const server_id = authPayload?.server_id ?? null;
  const pabx_id = authPayload?.pabx_id ?? null;

  if (server_id && pabx_id) {
    const response = await request.get<DefaultTypedApiResponse<T>>(
      `/api/server/${server_id}/pabx/${pabx_id}/${url}?per_page=${perPage}`,
      { params },
    );

    return response;
  }

  throw new Error("Erro ao buscar dados");
}
