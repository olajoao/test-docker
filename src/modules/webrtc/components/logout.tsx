/**
 * Componente Logout
 * Botão para desconectar e sair do sistema WebRTC
 * 
 * Migrado de: lib/components/Logout.jsx
 */

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createLogger } from '../lib/logger';

const logger = createLogger('Logout');

interface LogoutProps {
  onLogout: () => void;
}

export function Logout({ onLogout }: LogoutProps) {
  const handleLogout = () => {
    logger.debug('handleLogout()');
    onLogout();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="gap-2 hidden sm:flex"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Sair</span>
    </Button>
  );
}
