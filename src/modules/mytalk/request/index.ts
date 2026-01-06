import axios, { type CreateAxiosDefaults } from "axios";

interface AuthPayload {
  base_url?: string;
  access_token?: string;
  [key: string]: unknown;
}

function getAuthPayload(): AuthPayload {
  const token = localStorage.getItem("app_token");
  if (!token) return {};

  try {
    const decoded = atob(token);
    try {
      return JSON.parse(decoded);
    } catch {
      console.error("Not a valid json format");
      return {};
    }
  } catch {
    console.error("Invalid token");
    return {};
  }
}

const config: CreateAxiosDefaults = {
  baseURL: "",
  withCredentials: true,
};

const request = axios.create(config);

request.interceptors.request.use(
  function (config) {
    const authPayload = getAuthPayload();

    if (authPayload?.base_url) {
      config.baseURL = authPayload.base_url;
    }

    if (authPayload?.access_token) {
      config.headers.Authorization = `Bearer ${authPayload.access_token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default request;
