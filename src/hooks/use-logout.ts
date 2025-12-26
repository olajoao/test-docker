import { useAppToken } from "./use-app-token";

export const useLogout = () => {
  const { appToken } = useAppToken();

  function logout() {
    const base = appToken?.settings?.webrtc_url?.split('/v')?.[0]
    const target = base ? `${base}/index.php` : '/login'
    window.location.replace(target)
  }

  return { logout }
}
