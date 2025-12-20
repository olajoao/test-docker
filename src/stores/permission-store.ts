import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { type PermissionState } from '@/api/types/permission';

 
export const usePermissionStore = create<PermissionState>()(
  devtools(
    persist(
      (set, get) => ({
        permissions: [],
        lastUpdated: null,
        status: 'idle',
        errorMessage: null,

        // ============================================
        // GETTERS - Verificação de permissões
        // ============================================

        hasPermission: (permission: string) => {
          const { permissions, status } = get();
          if (status !== 'loaded') return false;
          if (permissions.length === 0) return false;
          return permissions.includes(permission);
        },

        hasAllPermissions: (requiredPermissions: string[]) => {
          const { permissions, status } = get();
          if (status !== 'loaded') return false;
          if (permissions.length === 0) return false;
          return requiredPermissions.every((p: string) => permissions.includes(p));
        },

        hasAnyPermission: (requiredPermissions: string[]) => {
          const { permissions, status } = get();
          if (status !== 'loaded') return false;
          if (permissions.length === 0) return false;
          return requiredPermissions.some((p: string) => permissions.includes(p));
        },
 
        // ============================================
        // SETTERS - Gerenciamento de estado
        // ============================================

        setStatus: (status) => {
          set({ status });
        },

        setError: (message) => {
          set({ status: 'error', errorMessage: message });
        },

        setPermissions: (permissions: string[]) => {
          set({
            permissions,
            lastUpdated: Date.now(),
            status: 'loaded',
            errorMessage: null,
          });
        },

        clearPermissions: () => {
          set({
            permissions: [],
            lastUpdated: null,
            status: 'idle',
            errorMessage: null,
          });
        },
      }),
      {
        name: 'spx-permissions',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          permissions: state.permissions,
          lastUpdated: state.lastUpdated,
        }),
      }
    ),
    { name: 'PermissionStore' }
  )
);