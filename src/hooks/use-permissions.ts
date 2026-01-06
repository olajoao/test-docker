import { usePermissionStore } from '@/stores/permission-store';
import { useQuery } from '@tanstack/react-query';
import { permissionService } from '@/api/services';
import { USE_MOCK_PERMISSIONS, getMockPermissions } from '@/mocks/permissions.mock';
import { useEffect } from 'react';

 
export function usePermissions() {
  const { setPermissions, setStatus, setError } = usePermissionStore();

  const query = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      return USE_MOCK_PERMISSIONS 
        ? await getMockPermissions()
        : await permissionService.list();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (antigo cacheTime)
  });

  // Sincroniza com Zustand store para manter compatibilidade
  useEffect(() => {
    if (query.isLoading) {
      setStatus('loading');
    } else if (query.isError) {
      setStatus('error');
      setError(query.error instanceof Error ? query.error.message : 'Erro ao buscar permissões');
      setPermissions([]);
    } else if (query.isSuccess && query.data) {
      setPermissions(query.data);
    }
  }, [query.isLoading, query.isError, query.isSuccess, query.data, query.error, setPermissions, setStatus, setError]);

  return {
    permissions: query.data || [],
    isLoading: query.isPending || query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}


export function useHasPermission(permission: string): boolean {
  return usePermissionStore(state => state.hasPermission(permission));
}

export function useHasAllPermissions(permissions: string[]): boolean {
  return usePermissionStore(state => state.hasAllPermissions(permissions));
}

 