export type PermissionStatus = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Estado do store de permissões
 * Store: gerencia estado e verificações
 * Hook (usePermissions): gerencia fetch via React Query
 */
export interface PermissionState {
  // ============================================
  // STATE - Dados de permissões
  // ============================================
  
  /** Array de strings que representam as permissões do usuário */
  permissions: string[];
  
  /** Timestamp da última atualização */
  lastUpdated: number | null;
  
  /** Status do fetch de permissões */
  status: PermissionStatus;
  
  /** Mensagem de erro, se houver */
  errorMessage: string | null;
 
  // ============================================
  // SETTERS - Gerenciamento de estado
  // ============================================
  
  setPermissions: (permissions: string[]) => void;
  clearPermissions: () => void;
  setStatus: (status: PermissionStatus) => void;
  setError: (message: string | null) => void;

  // ============================================
  // GETTERS - Verificação de permissões
  // ============================================
  
  /** Verifica se usuário tem uma permissão específica */
  hasPermission: (permission: string) => boolean;
  
  /** Verifica se usuário tem TODAS as permissões listadas */
  hasAllPermissions: (permissions: string[]) => boolean;
  
  /** Verifica se usuário tem QUALQUER UMA das permissões listadas */
  hasAnyPermission: (permissions: string[]) => boolean;
  
}

