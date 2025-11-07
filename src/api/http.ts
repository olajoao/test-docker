import axios from "axios"

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_NYA_BASE_URL ?? import.meta.env.VITE_API_DEV_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI4IiwianRpIjoiMGZjODBiZTNhM2EyYmY0MDlkN2Y4MzBjYTEzZThhYWZjZDU2YWJkYTQ2MGFkZGJiMDViOWQwYzA4MTlmZmFjNjViMTc0NjBjZGQ3MDQ2N2UiLCJpYXQiOjE3NjIzNzgzMjIuMDI1MzA0LCJuYmYiOjE3NjIzNzgzMjIuMDI1MzA2LCJleHAiOjE3OTM5MTQzMjIuMDE2NzQ1LCJzdWIiOiI3Iiwic2NvcGVzIjpbXX0.EIHO1UOxjbmfZfqPbwMYccSdpxvc55bN-rE_K81sftFAqVc_JKoF8l7itnoDMtqtvuQrfc-0Bc0Sgr63DEUmeeS60QuF2vSnqHVnVxMIAAR3eVeXmNWOox6mQ0lsCi-7KWHCM0k8cuEa58UfrnNwdSTu4UjbnYX1VF9t5EM2JQf3mpgTFxVu56EeDm-GC1syUGGSdwQYGpTVHL8oHuZu7z-C2F2ZgmpJh5Olh-JnJJOgQEP08wJ9O2IaU9NgtV8DnwzIjputelH6OtWv70mkm9RW5c7jKsOwxQ_eWtX-F33FKi75G-6EhAe3dwuY32FvQ4MHFf1ZhUikKfiBTOcHLHHMCKB_ju3S66OGUELx7itHwMVIpsYKwHK_WaCMtidW3xX8AeHWreuR6MMCPhQxYFF93S9_-szNLO5DEYQk5V2ChuTEr05rtQeTZvRi95j-ekBOHllg2sRw-iMfJLnmjaA0DS0Ab3G4WXacRE-jLGS_ZITQfyYoHjGVfnL4m28CVHqaVKWK8MGDUGzVOKkwybqLDGKTszU7Vl1YDptEZbPlQX5k5f_C2kwfMDW3nYJZg7MUxQg6ORvQLTi84zoqYQ9a457VhvzdwsiX-lIfC6GTFm705JZMCV6WISdVNq3-1p7rmKaINdWP-AQ-9DvJYkiYyPdmttAg_og-6oje-MU",
  },
  withCredentials: true
})

http.interceptors.request.use((config) => {
  const appData = localStorage.getItem('app_data')
  const accessToken = appData ? JSON.parse(appData).access_token : ''

  if (accessToken && accessToken.length) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post(import.meta.env.VITE_API_NYA_BASE_URL + '/oauth/refresh', { refresh_token: refreshToken });

      localStorage.setItem('access_token', response.data.access_token);
      http.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;
      return http(originalRequest);
    }

    return Promise.reject(error);
  }
)
