
import request from "@/modules/mytalk/request";
import type { AxiosInstance } from "axios";
import type { DefaultTypedApiResponse, HttpClientCommon } from "../interfaces/reports";

function readAppTokenPayload(): Record<string, any> {
  const token = localStorage.getItem("app_token");
  if (!token) return {};

  try {
    return JSON.parse(atob(token));
  } catch {
    return {};
  }
}

export class CommonRequestAdapter implements HttpClientCommon {
  private httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  async get<T>(
    endpoint: string,
    params?: URLSearchParams,
  ): Promise<DefaultTypedApiResponse<T>> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;
    const response = await this.httpClient.get<DefaultTypedApiResponse<T>>(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}`,
      {
        params,
      },
    );
    return response.data;
  }

  async post<T>(endpoint: string, data: T): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;

    return await this.httpClient.post(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}`,
      data,
    );
  }

  async postWithMethodPut<T>(endpoint: string, data: T): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;
    return await this.httpClient.post(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}&_method=PUT`,
      data,
    );
  }

  async put<T>(endpoint: string, data: T): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;

    return await this.httpClient.put(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}`,
      data,
    );
  }

  async delete(endpoint: string): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;

    return await this.httpClient.delete(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}`,
    );
  }
}

export const httpClientCommon: HttpClientCommon = new CommonRequestAdapter(
  request,
);
