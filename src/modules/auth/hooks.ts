import { authService, permissionService } from "@/api/services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AuthProps, AuthSuccessProps } from "./model"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth-store"
import { usePermissionStore } from "@/stores/permission-store"
import { useTranslation } from "@/hooks/use-translation"
import { MOCK_PERMISSIONS, USE_MOCK_PERMISSIONS } from "@/mocks/permissions.mock"
import { useEffect } from "react"
import { getFirstAvailableRoute } from "@/config/permission-routes"

// ============================================
// Hook de Autenticação
// ============================================
export const useAuth = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  
  const setAuth = useAuthStore().setAuth
  const authLogout = useAuthStore().logout
  const { clearPermissions } = usePermissionStore()

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: AuthProps) => authService.create(payload),
    onSuccess: handleSuccess,
    onError: handleError
  })

  async function handleSuccess(response: AuthSuccessProps) {
    // 1. Salva tokens no Zustand
    setAuth({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
      token_type: response.token_type,
      expires_in: response.expires_in,
    })

    // 2. Busca permissões antes de navegar
    try {
      const permissions = USE_MOCK_PERMISSIONS 
        ? MOCK_PERMISSIONS 
        : await permissionService.list()

      // 3. Salva permissões no Zustand
      usePermissionStore.getState().setPermissions(permissions)

      // 4. Redireciona para primeira rota disponível
      const targetRoute = getFirstAvailableRoute(permissions)
      
      toast.success(t('auth.login_success'))
      navigate({ to: targetRoute })
    } catch (error) {
      console.error('Erro ao buscar permissões:', error)
      toast.error('Erro ao carregar permissões')
      authLogout()
    }
  }

  function handleError() {
    toast.warning(t('auth.login_error'))
  }

  const form = useForm({
    defaultValues: {
      login: '',
      password: ''
    },
    onSubmit: async () => {
      const payload: AuthProps = {
        grant_type: "password",
        client_id: 7,
        client_secret: "vMeKD4XOqO2GHw8ce47nF2c8uI7OZBU96Efc1zPO",
        username: "660:developers@elevensoft.dev",
        scope: "",
        password: "spx@spx",
      }

      return await loginMutation.mutateAsync(payload)
    }
  })

  const handleLogout = () => {
    authLogout()
    clearPermissions()
    queryClient.removeQueries({ queryKey: ['permissions'] })
    toast.info(t('auth.logout_success'))
    navigate({ to: '/login' })
  }

  return {
    form, 
    loginMutation,
    handleLogout,
    isLoading: loginMutation.isPending,
  }
}

// ============================================
// Hook de Permissões (React Query)
// ============================================
export const usePermissions = () => {
  const { setPermissions, setStatus, setError } = usePermissionStore()

  const query = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      if (USE_MOCK_PERMISSIONS) {
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 500))
        return MOCK_PERMISSIONS
      }
      return permissionService.list()
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  })

  // Sincroniza com Zustand quando dados mudam
  useEffect(() => {
    if (query.isLoading) {
      setStatus('loading')
    } else if (query.isError) {
      setStatus('error')
      setError(query.error?.message || 'Erro ao carregar permissões')
    } else if (query.isSuccess && query.data) {
      setPermissions(query.data)
    }
  }, [query.isLoading, query.isError, query.isSuccess, query.data, setStatus, setError, setPermissions])

  return {
    permissions: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

// ============================================
// Hooks Auxiliares de Permissões
// ============================================
export const useHasPermission = (permission: string) => {
  const hasPermission = usePermissionStore(state => state.hasPermission)
  return hasPermission(permission)
}

export const useHasAllPermissions = (permissions: string[]) => {
  const hasAllPermissions = usePermissionStore(state => state.hasAllPermissions)
  return hasAllPermissions(permissions)
}

export const useHasAnyPermission = (permissions: string[]) => {
  const hasAnyPermission = usePermissionStore(state => state.hasAnyPermission)
  return hasAnyPermission(permissions)
}
