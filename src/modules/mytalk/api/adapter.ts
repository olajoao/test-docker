import request from "@/modules/mytalk/request";
import type { AxiosInstance } from "axios";
import type { DefaultTypedApiResponse, HttpClient } from "../interfaces/reports";

function readAppTokenPayload(): Record<string, any> {
  const token = localStorage.getItem("app_token");
  if (!token) return {};

  try {
    return JSON.parse(atob(token));
  } catch {
    return {};
  }
}

export class RequestAdapter implements HttpClient {
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
    const user = authPayload.user;
    const response = await this.httpClient.get<DefaultTypedApiResponse<T>>(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}?user=${user}`,
      {
        params,
      },
    );
    return response.data;
  }

  async getDefault<T>(
    endpoint: string,
    params?: URLSearchParams,
    config?: Record<string, any>,
  ): Promise<T> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;
    const user = authPayload.user;
    const response = await this.httpClient.get<T>(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}?user=${user}`,
      {
        params,
        headers: { ...config },
      },
    );

    return response.data;
  }

  async getFiles<T>(
    endpoint: string,
    params?: URLSearchParams,
    config?: Record<string, any>,
  ): Promise<T> {
    const response = await this.httpClient.get<T>(`${endpoint}`, {
      params,
      headers: { ...config },
    });

    return response.data;
  }

  async post<T>(endpoint: string, data: T): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;
    const user = authPayload.user;

    return await this.httpClient.post(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}?user=${user}`,
      data,
    );
  }

  async postWithMethodPut<T>(endpoint: string, data: T): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;
    const user = authPayload.user;
    return await this.httpClient.post(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}?user=${user}&_method=PUT`,
      data,
    );
  }

  async put<T>(endpoint: string, data: T): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;
    const user = authPayload.user;

    return await this.httpClient.put(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}?user=${user}`,
      data,
    );
  }

  async delete(endpoint: string): Promise<void> {
    const authPayload = readAppTokenPayload();
    const serverId = authPayload.server_id;
    const pabxId = authPayload.pabx_id;
    const user = authPayload.user;

    return await this.httpClient.delete(
      `api/server/${serverId}/pabx/${pabxId}/${endpoint}?user=${user}`,
    );
  }
}

export const httpClient: HttpClient = new RequestAdapter(request);
