import axios from "axios"
import { useAuthStore } from "@/stores/auth-store"
import { usePermissionStore } from "@/stores/permission-store"

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_NYA_BASE_URL ?? import.meta.env.VITE_API_DEV_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
})

http.interceptors.request.use((config) => {
  // Busca token diretamente da store Zustand
  const accessToken = useAuthStore.getState().getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 = Token inválido/expirado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Busca refresh token da store Zustand
      const refreshToken = useAuthStore.getState().getRefreshToken()

      if (!refreshToken) {
        // Sem refresh token, faz logout
        useAuthStore.getState().logout()
        usePermissionStore.getState().clearPermissions()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          import.meta.env.VITE_API_NYA_BASE_URL + '/oauth/refresh', 
          { refresh_token: refreshToken }
        );

        // Atualiza tokens no Zustand (persist já salva no localStorage)
        useAuthStore.getState().setAuth({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          token_type: response.data.token_type || 'Bearer',
          expires_in: response.data.expires_in || 31536000,
        })
        
        // Atualiza header e retenta request
        http.defaults.headers.common.Authorization = `Bearer ${response.data.access_token}`;
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return http(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, faz logout completo
        useAuthStore.getState().logout()
        usePermissionStore.getState().clearPermissions()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // 403 = Sem permissão - atualiza permissões
    if (error.response?.status === 403) {
      try {
        const accessToken = useAuthStore.getState().getAccessToken()
        if (accessToken) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_NYA_BASE_URL}/api/permissions`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const permissions = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || []
          usePermissionStore.getState().setPermissions(permissions)
        }
      } catch {
        // Se falhar ao buscar permissões, ignora
      }
    }

    return Promise.reject(error);
  }
)
