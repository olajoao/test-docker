/**
 * Hook useJsSIP
 * Gerencia o JsSIP User Agent, conexão WebSocket, registro SIP e sessões de chamadas
 */

import { useEffect, useRef, useCallback } from 'react';
import JsSIP from 'jssip';
import { useWebRTCStore } from '../stores/webrtc-store';
import { useAudioPlayer } from './use-audio-player';
import { createLogger } from '../lib/logger';
import type { 
  UA, 
  UAConfiguration, 
  RTCSession, 
  CallOptions,
  WebSocketConfiguration 
} from '../types';
import { generateId } from '../lib/utils';

// Expor JsSIP globalmente para compatibilidade
if (typeof window !== 'undefined') {
  (window as any).JsSIP = JsSIP;
}

const logger = createLogger('useJsSIP');

interface UseJsSIPOptions {
  autoConnect?: boolean;
  autoRegister?: boolean;
}

interface UseJsSIPReturn {
  ua: UA | null;
  isInitialized: boolean;
  connect: () => void;
  disconnect: () => void;
  register: () => void;
  unregister: () => void;
  call: (target: string) => void;
  answerIncoming: () => void;
  rejectIncoming: () => void;
}

export function useJsSIP(options: UseJsSIPOptions = {}): UseJsSIPReturn {
  const { autoConnect = false, autoRegister = true } = options;

  // Store
  const {
    settings,
    ua,
    setUA,
    setConnectionStatus,
    setRegistered,
    setIncomingCall,
    setActiveCall,
    addNotification,
    displayName,
  } = useWebRTCStore();

  // Audio
  const audioPlayer = useAudioPlayer();

  // Refs
  const uaRef = useRef<UA | null>(null);
  const connectingRef = useRef(false);

  // ==================== UA Initialization ====================
  const initializeUA = useCallback(() => {
    if (uaRef.current) {
      logger.warn('UA already initialized');
      return uaRef.current;
    }

    if (!JsSIP) {
      logger.error('JsSIP library not loaded');
      addNotification({
        type: 'error',
        message: 'JsSIP library not loaded. Please include the library.',
        duration: 5000,
      });
      return null;
    }

    logger.info('Initializing UA with settings:', settings);

    try {
      // Criar WebSocket usando JsSIP.WebSocketInterface
      const socket = new JsSIP.WebSocketInterface(settings.socket.uri);

      // Aplicar via_transport se não for 'auto'
      if (settings.socket.via_transport && settings.socket.via_transport !== 'auto') {
        logger.debug(`Setting via_transport to: ${settings.socket.via_transport}`);
        socket.via_transport = settings.socket.via_transport;
      }

      // Configuração do UA
      const config: UAConfiguration = {
        uri: settings.uri || '',
        password: settings.password || '',
        display_name: settings.display_name || displayName,
        sockets: [socket],
        registrar_server: settings.registrar_server || undefined,
        contact_uri: settings.contact_uri || undefined,
        authorization_user: settings.authorization_user || undefined,
        instance_id: settings.instance_id || undefined,
        session_timers: settings.session_timers,
        use_preloaded_route: settings.use_preloaded_route,
      };

      // Criar UA
      const newUA = new JsSIP.UA(config);

      // Configurar event listeners
      setupUAEventListeners(newUA);

      uaRef.current = newUA;
      setUA(newUA);

      // Expor globalmente para debugging (apenas em DEV)
      if (import.meta.env.DEV) {
        logger.debug('Exposing UA to window for debugging');
        (window as any).UA = newUA;
      }

      // Integração Callstats.io (se habilitado)
      if (settings.callstats.enabled && settings.callstats.AppID && settings.callstats.AppSecret) {
        logger.info('Initializing Callstats.io integration');
        try {
          // Carregar callstats-jssip se disponível
          // Nota: precisa do pacote 'callstats-jssip' instalado
          // npm install callstats-jssip
          if ((window as any).callstatsjssip) {
            (window as any).callstatsjssip(
              newUA,
              settings.callstats.AppID,
              settings.callstats.AppSecret
            );
            logger.info('Callstats.io integration enabled');
          } else {
            logger.warn('callstatsjssip not loaded - skipping integration');
          }
        } catch (error) {
          logger.error('Failed to initialize Callstats.io:', error);
        }
      }

      logger.info('UA initialized successfully');
      return newUA;
    } catch (error) {
      logger.error('Failed to initialize UA:', error);
      addNotification({
        type: 'error',
        message: 'Failed to initialize SIP client',
        duration: 5000,
      });
      return null;
    }
  }, [settings, displayName, setUA, addNotification]);

  // ==================== UA Event Listeners ====================
  const setupUAEventListeners = useCallback((ua: UA) => {
    // React StrictMode pode montar/desmontar e acabar anexando listeners duplicados.
    // Marcar no próprio UA para garantir que só anexamos uma vez por instância.
    const uaAny = ua as any;
    if (uaAny.__webrtcListenersAttached) {
      logger.debug('UA event listeners already attached - skipping');
      return;
    }
    uaAny.__webrtcListenersAttached = true;

    // Connecting
    ua.on('connecting', (event) => {
      logger.info('Connecting to WebSocket...', event);
      setConnectionStatus('connecting');
      connectingRef.current = true;
    });

    // Connected
    ua.on('connected', (event) => {
      logger.info('Connected to WebSocket', event);
      setConnectionStatus('connected');
      connectingRef.current = false;

      addNotification({
        type: 'success',
        message: 'Connected to server',
        duration: 3000,
      });
    });

    // Disconnected
    ua.on('disconnected', (event) => {
      logger.warn('Disconnected from WebSocket', event);
      setConnectionStatus('disconnected');
      setRegistered(false);
      connectingRef.current = false;

      addNotification({
        type: 'warning',
        message: 'Disconnected from server',
        duration: 3000,
      });
    });

    // Registered
    ua.on('registered', (event) => {
      logger.info('Registered with SIP server', event);
      setConnectionStatus('registered');
      setRegistered(true);

      addNotification({
        type: 'success',
        message: 'Registered successfully',
        duration: 3000,
      });
    });

    // Unregistered
    ua.on('unregistered', (event) => {
      logger.info('Unregistered from SIP server', event);
      setRegistered(false);
    });

    // Registration Failed
    ua.on('registrationFailed', (event) => {
      logger.error('Registration failed', event);
      setRegistered(false);

      addNotification({
        type: 'error',
        message: 'Registration failed. Please check your credentials.',
        duration: 5000,
      });
    });

    // New RTC Session (Incoming/Outgoing call)
    ua.on('newRTCSession', (event) => {
      const session = event.session;
      const isIncoming = session.direction === 'incoming';

      logger.info(`New ${isIncoming ? 'incoming' : 'outgoing'} call`, event);

      if (isIncoming) {
        handleIncomingCall(session);
      } else {
        handleOutgoingCall(session);
      }
    });
  }, [setConnectionStatus, setRegistered, addNotification]);

  // ==================== Incoming Call Handler ====================
  const handleIncomingCall = useCallback((session: RTCSession) => {
    logger.info('Handling incoming call from:', session.remote_identity.uri);

    // Tocar som de chamada recebida
    audioPlayer.play('ringing');

    // Salvar sessão de entrada
    setIncomingCall(session);

    // Notificar usuário
    const uriString = session.remote_identity.uri.toString();
    const displayName = session.remote_identity.display_name || 
                       uriString.replace(/^sip:/, '').split('@')[0];

    addNotification({
      type: 'info',
      message: `Incoming call from ${displayName}`,
      duration: 30000,
    });

    // Event listeners da sessão
    setupIncomingSessionListeners(session);
  }, [audioPlayer, setIncomingCall, addNotification]);

  // ==================== Outgoing Call Handler ====================
  const handleOutgoingCall = useCallback((session: RTCSession) => {
    logger.info('Handling outgoing call to:', session.remote_identity.uri);

    // Tocar som de chamada em andamento (ringback)
    audioPlayer.play('ringback');

    // Criar call state
    const uriString = session.remote_identity.uri.toString();
    
    // Extrair display name do SIP
    let displayName = session.remote_identity.display_name;
    if (!displayName || displayName.trim() === '') {
      // Tentar extrair do URI: sip:208@host ou sip:1_208_webrtc@host
      const userPart = uriString.replace(/^sip:/, '').split('@')[0];
      // Remover prefixo como "1_" se existir
      displayName = userPart.includes('_') ? userPart.split('_').pop() || userPart : userPart;
    }
    
    const callState = {
      id: generateId('call'),
      direction: 'outgoing' as const,
      session,
      status: 'progress' as const,
      localStream: null,
      remoteStream: null,
      startTime: null,
      endTime: null,
      duration: 0,
      isHeld: false,
      isMuted: false,
      displayName: displayName,
      uri: uriString,
    };

    setActiveCall(callState);

    // Event listeners da sessão
    setupOutgoingSessionListeners(session);
  }, [audioPlayer, setActiveCall]);

  // ==================== Session Event Listeners (Incoming) ====================
  const setupIncomingSessionListeners = useCallback((session: RTCSession) => {
    // Failed (quando a chamada falha antes de ser aceita)
    session.on('failed', (event) => {
      logger.info('Incoming call failed:', event);
      audioPlayer.stop('ringing');
      setIncomingCall(null);
      setActiveCall(null);

      addNotification({
        type: 'error',
        message: 'Call failed',
        duration: 3000,
      });
    });

    // Accepted (quando o usuário atende)
    session.on('accepted', () => {
      logger.info('Incoming call accepted');
      audioPlayer.stop('ringing');
      
      // Atualizar status do activeCall (já foi criado no answerIncoming)
      setActiveCall((current) => {
        if (!current) {
          logger.warn('No active call on accepted event');
          return null;
        }
        
        // Apenas atualizar status, manter session e demais propriedades
        logger.debug('Updating call status to answered');
        return {
          ...current,
          status: 'answered',
          startTime: current.startTime || new Date(),
        };
      });
      
      // Garantir que incoming está limpo
      setIncomingCall(null);
    });

    // Confirmed (quando a chamada está confirmada)
    session.on('confirmed', () => {
      logger.info('Incoming call confirmed');

      setActiveCall((current) => {
        if (!current) return null;
        return {
          ...current,
          status: 'confirmed',
        };
      });
    });

    // Ended (quando a chamada termina enquanto ainda está incoming ou depois de aceita)
    session.on('ended', (event) => {
      logger.info('Incoming call ended:', event);
      audioPlayer.stop('ringing');
      audioPlayer.stopAll();
      setIncomingCall(null);
      setActiveCall(null);
    });

    // Peer Connection - configurar ANTES de answer() ser chamado
    session.on('peerconnection', (event) => {
      logger.info('Peer connection established for incoming call', event);

      const peerConnection = event.peerconnection;

      // Listener para remote stream
      peerConnection.ontrack = (trackEvent) => {
        logger.info('Remote track received', trackEvent);

        if (trackEvent.streams && trackEvent.streams[0]) {
          const remoteStream = trackEvent.streams[0];
          
          setActiveCall((current) => {
            if (!current) {
              logger.warn('No active call when remote track received');
              return null;
            }
            
            logger.debug('Setting remote stream to active call');
            return {
              ...current,
              remoteStream,
            };
          });
        }
      };

      // Configurar local stream quando disponível
      session.connection.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === 'audio') {
          const localStream = new MediaStream([sender.track]);
          
          setActiveCall((current) => {
            if (!current) return null;
            return {
              ...current,
              localStream,
            };
          });
        }
      });
    });

    // ICE Candidate Filtering (crítico para NAT)
    session.on('icecandidate', (event) => {
      // Filtrar apenas candidates srflx com related address
      // Isso melhora a conectividade em cenários NAT complexos
      if (
        event.candidate.type === 'srflx' &&
        event.candidate.relatedAddress !== null &&
        event.candidate.relatedPort !== null
      ) {
        logger.debug('ICE candidate (srflx) accepted:', event.candidate);
        event.ready();
      }
    });
  }, [audioPlayer, setIncomingCall, setActiveCall, addNotification]);

  // ==================== Session Event Listeners (Outgoing) ====================
  const setupOutgoingSessionListeners = useCallback((session: RTCSession) => {
    // Progress
    session.on('progress', () => {
      logger.info('Call in progress');
    });

    // Accepted (quando o destinatário atende)
    session.on('accepted', () => {
      logger.info('Call accepted by remote');
      audioPlayer.stop('ringback');
      audioPlayer.play('answered');

      // Atualizar call state
      setActiveCall((current) => {
        if (!current) return null;
        return {
          ...current,
          status: 'answered',
          startTime: new Date(),
        };
      });
    });

    // Confirmed
    session.on('confirmed', () => {
      logger.info('Call confirmed');

      setActiveCall((current) => {
        if (!current) return null;
        return {
          ...current,
          status: 'confirmed',
        };
      });
    });

    // Failed
    session.on('failed', (event) => {
      logger.info('Outgoing call failed:', event);
      audioPlayer.stop('ringback');
      audioPlayer.play('rejected');
      setActiveCall(null);

      addNotification({
        type: 'error',
        message: `Call failed: ${event.cause}`,
        duration: 3000,
      });
    });

    // Ended
    session.on('ended', (event) => {
      logger.info('Outgoing call ended:', event);
      audioPlayer.stopAll();
      setActiveCall(null);

      addNotification({
        type: 'info',
        message: 'Call ended',
        duration: 3000,
      });
    });

    // Peer Connection
    session.on('peerconnection', (event) => {
      logger.info('Peer connection established', event);

      const peerConnection = event.peerconnection;

      // Listener para remote stream
      peerConnection.ontrack = (trackEvent) => {
        logger.info('Remote track received', trackEvent);

        if (trackEvent.streams && trackEvent.streams[0]) {
          const remoteStream = trackEvent.streams[0];
          
          setActiveCall((current) => {
            if (!current) {
              logger.warn('No active call when remote track received');
              return null;
            }
            
            logger.debug('Setting remote stream to active call');
            return {
              ...current,
              remoteStream,
            };
          });
        }
      };

      // Configurar local stream quando disponível
      session.connection.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === 'audio') {
          const localStream = new MediaStream([sender.track]);
          
          setActiveCall((current) => {
            if (!current) return null;
            return {
              ...current,
              localStream,
            };
          });
        }
      });
    });

    // ICE Candidate Filtering (crítico para NAT)
    session.on('icecandidate', (event) => {
      // Filtrar apenas candidates srflx com related address
      // Isso melhora a conectividade em cenários NAT complexos
      if (
        event.candidate.type === 'srflx' &&
        event.candidate.relatedAddress !== null &&
        event.candidate.relatedPort !== null
      ) {
        logger.debug('ICE candidate (srflx) accepted:', event.candidate);
        event.ready();
      }
    });

    // Expor session para debugging (apenas em DEV)
    if (import.meta.env.DEV) {
      (window as any).SESSION = session;
    }
  }, [audioPlayer, setActiveCall, addNotification]);

  // ==================== Connect ====================
  const connect = useCallback(() => {
    if (!uaRef.current) {
      logger.warn('UA not initialized, initializing now...');
      const newUA = initializeUA();
      if (!newUA) return;
    }

    if (connectingRef.current) {
      logger.warn('Already connecting...');
      return;
    }

    logger.info('Starting UA...');
    uaRef.current?.start();
  }, [initializeUA]);

  // ==================== Disconnect ====================
  const disconnect = useCallback(() => {
    if (!uaRef.current) {
      logger.warn('UA not initialized');
      return;
    }

    logger.info('Stopping UA...');
    uaRef.current.stop();
    setConnectionStatus('disconnected');
    setRegistered(false);
  }, [setConnectionStatus, setRegistered]);

  // ==================== Register ====================
  const register = useCallback(() => {
    if (!uaRef.current) {
      logger.warn('UA not initialized');
      return;
    }

    logger.info('Registering...');
    uaRef.current.register();
  }, []);

  // ==================== Unregister ====================
  const unregister = useCallback(() => {
    if (!uaRef.current) {
      logger.warn('UA not initialized');
      return;
    }

    logger.info('Unregistering...');
    uaRef.current.unregister({ all: true });
  }, []);

  // ==================== Make Call ====================
  const call = useCallback((target: string, options?: CallOptions) => {
    if (!uaRef.current) {
      logger.error('UA not initialized');
      addNotification({
        type: 'error',
        message: 'Cannot make call: not connected',
        duration: 3000,
      });
      return null;
    }

    logger.info('Making call to:', target);

    try {
      const session = uaRef.current.call(target, {
        mediaConstraints: {
          audio: true,
          video: false,
        },
        pcConfig: settings.pcConfig,
        ...options,
      });

      return session;
    } catch (error) {
      logger.error('Failed to make call:', error);
      addNotification({
        type: 'error',
        message: 'Failed to make call',
        duration: 3000,
      });
      return null;
    }
  }, [settings, addNotification]);

  // ==================== Answer Incoming Call ====================
  const answerIncoming = useCallback(() => {
    const { incomingCall } = useWebRTCStore.getState();
    
    if (!incomingCall) {
      logger.warn('No incoming call to answer');
      return;
    }

    logger.info('Answering incoming call');
    
    try {
      // Criar active call ANTES de atender para transição suave
      const uriString = incomingCall.remote_identity.uri.toString();
      
      // Extrair display name do SIP
      let displayName = incomingCall.remote_identity.display_name;
      if (!displayName || displayName.trim() === '') {
        // Tentar extrair do URI: sip:208@host ou sip:1_208_webrtc@host
        const userPart = uriString.replace(/^sip:/, '').split('@')[0];
        // Remover prefixo como "1_" se existir
        displayName = userPart.includes('_') ? userPart.split('_').pop() || userPart : userPart;
      }
      
      const callState = {
        id: generateId('call'),
        direction: 'incoming' as const,
        session: incomingCall,
        status: 'progress' as const, // Começa como progress, muda para answered no evento
        localStream: null,
        remoteStream: null,
        startTime: new Date(),
        endTime: null,
        duration: 0,
        isHeld: false,
        isMuted: false,
        displayName: displayName,
        uri: uriString,
      };
      
      // Mover para activeCall e limpar incoming ANTES de answer
      setActiveCall(callState);
      setIncomingCall(null);
      
      const options = {
        mediaConstraints: {
          audio: true,
          video: false,
        },
        pcConfig: {
          iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
        },
      };

      incomingCall.answer(options);
      audioPlayer.stop('ringing');
      audioPlayer.play('answered');
    } catch (error) {
      logger.error('Error answering call:', error);
      addNotification({
        id: generateId(),
        type: 'error',
        message: 'Erro ao atender chamada',
      });
    }
  }, [audioPlayer, setActiveCall, setIncomingCall, addNotification]);

  // ==================== Reject Incoming Call ====================
  const rejectIncoming = useCallback(() => {
    const { incomingCall } = useWebRTCStore.getState();
    
    if (!incomingCall) {
      logger.warn('No incoming call to reject');
      return;
    }

    logger.info('Rejecting incoming call');
    
    try {
      incomingCall.terminate();
      audioPlayer.stop('ringing');
      setIncomingCall(null);
    } catch (error) {
      logger.error('Error rejecting call:', error);
    }
  }, [audioPlayer, setIncomingCall]);

  // ==================== Auto Connect ====================
  useEffect(() => {
    if (autoConnect && !uaRef.current) {
      const timer = setTimeout(() => {
        connect();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [autoConnect, connect]);

  // ==================== Cleanup ====================
  useEffect(() => {
    return () => {
      if (uaRef.current) {
        logger.info('Cleaning up UA');
        uaRef.current.stop();
        uaRef.current.removeAllListeners();
        uaRef.current = null;
        setUA(null);
      }
    };
  }, [setUA]);

  return {
    ua: uaRef.current,
    isInitialized: uaRef.current !== null,
    connect,
    disconnect,
    register,
    unregister,
    call,
    answerIncoming,
    rejectIncoming,
  };
}
