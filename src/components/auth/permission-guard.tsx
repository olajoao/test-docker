import { usePermissionStore } from '@/stores/permission-store';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface PermissionGuardProps {
  children: ReactNode;
  /** Permissão única necessária */
  permission?: string;
  /** OU todas essas permissões */
  allOf?: string[];
  /** O que mostrar se não tiver permissão (opcional) */
  fallback?: ReactNode;
}

/**
 * Componente que renderiza children apenas se o usuário tiver a permissão necessária.
 * 
 * @example
 * // Permissão única
 * <PermissionGuard permission="sip.branchs">
 *   <MenuItemRamais />
 * </PermissionGuard>
 * 
  
 * @example
 * // Todas as permissões
 * <PermissionGuard allOf={["relatorios", "relatorios.export"]}>
 *   <BotaoExportar />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  allOf,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, permissions, status } = usePermissionStore(
    useShallow((s) => ({
      hasPermission: s.hasPermission,
      hasAllPermissions: s.hasAllPermissions,
      permissions: s.permissions,
      status: s.status,
    }))
  );

  if (status !== 'loaded') {
    return <>{fallback}</>;
  }

  if (permissions.length === 0) {
    return <>{fallback}</>;
  }

  const hasAccess = useMemo(() => {
    if (permission) {
      return hasPermission(permission);
    } else if (allOf) {
      return hasAllPermissions(allOf);
    } else {
      return true;
    }
  }, [permission, allOf, hasPermission, hasAllPermissions]);

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}
