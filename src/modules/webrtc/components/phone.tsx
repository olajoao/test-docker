/**
 * Componente Phone
 * Container principal do sistema WebRTC - gerencia UA, conexão, chamadas
 * 
 * Migrado de: lib/components/Phone.jsx
 * Mudanças principais:
 * - Class Component → Function Component
 * - useJsSIP hook para gerenciar JsSIP
 * - useWebRTCStore para estado global
 * - Layout responsivo com TailwindCSS
 */

import { useEffect } from 'react';
import { Keyboard, Phone as PhoneIcon, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';
import { useWebRTCStore, selectHasActiveCall, selectHasIncomingCall } from '../stores/webrtc-store';
import { useJsSIP } from '../hooks/use-jssip';
import { useMediaPermissions } from '../hooks/use-media-permissions';
import { createLogger } from '../lib/logger';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { Logout } from './logout';
import { Dialer } from './dialer';
import { Session } from './session';
import { Incoming } from './incoming';
import { Button } from '@/components/ui/button';

const logger = createLogger('Phone');

// Helper para extrair último segmento do displayName (remove prefixos como "1_")
function getLastSegment(input?: string): string {
  if (!input) return 'Desconhecido';
  const parts = input.split('_');
  return parts[parts.length - 1];
}

interface PhoneProps {
  onExit: () => void;
}

export function Phone({ onExit }: PhoneProps) {
  const {
    activeCall,
    incomingCall,
    showDialpad,
    notifications,
    removeNotification,
    toggleDialpad,
    setShowDialpad,
  } = useWebRTCStore();

  const safeActiveCall =
    activeCall && typeof activeCall === 'object' && 'session' in (activeCall as any)
      ? (activeCall as any)
      : null;

  // Reactive checks - must use useWebRTCStore to react to changes
  const hasActiveCall = useWebRTCStore(selectHasActiveCall);
  const hasIncomingCall = useWebRTCStore(selectHasIncomingCall);
  const hasCallUI = hasActiveCall || hasIncomingCall;
  const canToggleDialpad = hasActiveCall;

  // Hooks
  const { connect, call, answerIncoming, rejectIncoming, isInitialized } = useJsSIP({ autoConnect: true });
  const { hasMicrophonePermission, requestPermissions } = useMediaPermissions();

  // Solicitar permissões ao montar
  useEffect(() => {
    if (!hasMicrophonePermission) {
      requestPermissions();
    }
  }, [hasMicrophonePermission, requestPermissions]);

  // Conectar automaticamente quando inicializar
  useEffect(() => {
    if (isInitialized && hasMicrophonePermission) {
      connect();
    }
  }, [isInitialized, hasMicrophonePermission, connect]);

  // Se não há chamada, garantir que não fique preso no modo teclado
  useEffect(() => {
    if (!hasCallUI && showDialpad) {
      setShowDialpad(false);
    }
  }, [hasCallUI, showDialpad, setShowDialpad]);

  // Em chamada recebida no mobile, sempre priorizar a tela de atendimento (não esconder com teclado)
  useEffect(() => {
    if (hasIncomingCall && showDialpad) {
      setShowDialpad(false);
    }
  }, [hasIncomingCall, showDialpad, setShowDialpad]);

  // Sistema de notificações - escutar mudanças no store e exibir com Sonner
  useEffect(() => {
    if (notifications.length === 0) return;

    // Pegar a última notificação
    const lastNotification = notifications[notifications.length - 1];

    // Exibir com Sonner baseado no tipo
    switch (lastNotification.type) {
      case 'success':
        toast.success(lastNotification.message, {
          duration: lastNotification.duration || 3000,
        });
        break;
      case 'error':
        toast.error(lastNotification.message, {
          duration: lastNotification.duration || 5000,
        });
        break;
      case 'warning':
        toast.warning(lastNotification.message, {
          duration: lastNotification.duration || 4000,
        });
        break;
      case 'info':
      default:
        toast.info(lastNotification.message, {
          duration: lastNotification.duration || 3000,
        });
        break;
    }

    // Remover do store após exibir
    const timer = setTimeout(() => {
      removeNotification(lastNotification.id);
    }, lastNotification.duration || 3000);

    return () => clearTimeout(timer);
  }, [notifications, removeNotification]);

  // Handlers
  const handleCall = (uri: string) => {
    logger.debug(`Making call to: ${uri}`);
    call(uri);
  };

  const handleAnswer = () => {
    logger.debug('Answering incoming call');
    answerIncoming();
  };

  const handleReject = () => {
    logger.debug('Rejecting incoming call');
    rejectIncoming();
  };

  // Classes condicionais para layout
  const containerClasses = cn(
    'h-full w-full flex flex-col',
    {
      'phone-has-session': hasActiveCall,
      'phone-has-incoming': hasIncomingCall,
      'mobile-show-dialpad': showDialpad,
    }
  );

  return (
    <>
      <div data-component="Phone" className={containerClasses}>
        {/* Header */}
        <header className="flex-none bg-background border-b">
        <div className="flex items-center justify-between py-2 px-4">
          <Logo size="small" />
          <Logout onLogout={onExit} />
        </div>
      </header>

      {/* Mobile call/dialpad toggle (outside header) */}
      {canToggleDialpad && (
        <div className="sm:hidden px-4 py-3 border-b bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={toggleDialpad}
            className="w-full justify-center gap-2"
          >
            {showDialpad ? (
              <>
                <PhoneIcon className="h-4 w-4" />
                Voltar para chamada
              </>
            ) : (
              <>
                <Keyboard className="h-4 w-4" />
                Ir para teclado
              </>
            )}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Dialer Sidebar */}
        <aside
          className={cn(
            'flex flex-none w-full lg:w-80 xl:w-96 border-b lg:border-r lg:border-b-0 bg-muted/30 overflow-y-auto justify-center lg:justify-start',
            'transition-all duration-300',
            {
              // Mobile: esconder teclado durante chamada recebida e durante chamada ativa (até o usuário alternar)
              'hidden sm:flex': hasIncomingCall || (hasActiveCall && !showDialpad),
              // Desktop: comportamento legado (esconde dialer durante chamada, a não ser que esteja em modo teclado)
              'lg:hidden': hasActiveCall && !showDialpad,
            }
          )}
        >
          <Dialer onCall={handleCall} showDialpad={showDialpad} />
        </aside>

        {/* Call Content Area */}
        <div
          className={cn(
            'flex-1 flex flex-col items-center justify-center p-4 lg:p-6',
            {
              // Mobile idle: esconde totalmente a área de conteúdo
              'hidden sm:flex': !hasCallUI,
              // Mobile em chamada + modo teclado: esconde a área da chamada
              'hidden lg:flex': hasCallUI && showDialpad,
            }
          )}
        >
          {/* Idle State */}
          {!hasActiveCall && !hasIncomingCall && (
            <IdleState />
          )}

          {/* Active Call */}
          {hasActiveCall && safeActiveCall && (
            <Session 
              session={safeActiveCall.session} 
              remoteDisplayName={getLastSegment(
                safeActiveCall.session.remote_identity?.display_name || 
                (safeActiveCall.session.remote_identity?.uri ? 
                  String(safeActiveCall.session.remote_identity.uri).replace(/^sip:/, '').split('@')[0] 
                  : safeActiveCall.displayName
                )
              )}
            />
          )}

          {/* Incoming Call */}
          {hasIncomingCall && incomingCall && (
            <Incoming 
              session={incomingCall}
              onAnswer={handleAnswer}
              onReject={handleReject}
            />
          )}
        </div>
      </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}


function IdleState() {

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500 w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-0">
          <PhoneCall className="h-16 w-16 lg:h-16 lg:w-16 text-primary/20" />
        </div>
        <PhoneCall className="relative h-16 w-16 lg:h-16 lg:w-16 text-primary" />
      </div>
    
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold hidden sm:block">Pronto para Ligar</h2>
      </div>

      <p className="text-sm text-muted-foreground max-w-md">
        Digite um número no teclado e pressione ligar para iniciar uma conversa
      </p>
    </div>
  );
}

// ==================== Footer ====================
function Footer() {
  return (
    <footer className="flex-none border-t bg-muted/50">
      <div className="flex flex-col sm:flex-row items-center gap-2 py-2 px-4 text-xs text-muted-foreground ">
        <p>© 2025 Saperx - All rights reserved</p>
      </div>
    </footer>
  );
}
