/**
 * Hook useMediaPermissions
 * Gerencia e verifica permissões de mídia (microfone/câmera)
 */

import { useEffect, useCallback, useRef } from 'react';
import { useWebRTCStore } from '../stores/webrtc-store';
import { createLogger } from '../lib/logger';
import type { MediaPermissionStatus } from '../types';

const logger = createLogger('useMediaPermissions');

export function useMediaPermissions() {
  const { mediaPermissions, setMediaPermissions, addNotification } = useWebRTCStore();
  const requestInFlightRef = useRef<Promise<boolean> | null>(null);

  // Verificar permissões atuais
  const checkPermissions = useCallback(async () => {
    if (!navigator.permissions) {
      logger.warn('Permissions API not supported');
      return;
    }

    try {
      // Verificar microfone
      const micPermission = await navigator.permissions.query({ 
        name: 'microphone' as PermissionName 
      });
      
      setMediaPermissions({
        microphone: micPermission.state as MediaPermissionStatus,
      });

      logger.info('Microphone permission:', micPermission.state);

      // Listener para mudanças
      micPermission.addEventListener('change', () => {
        setMediaPermissions({
          microphone: micPermission.state as MediaPermissionStatus,
        });
      });
    } catch (error) {
      logger.error('Failed to check permissions:', error);
    }
  }, [setMediaPermissions]);

  // Solicitar permissões
  const requestPermissions = useCallback(async () => {
    // Evita chamadas duplicadas (StrictMode / múltiplos cliques)
    if (mediaPermissions.microphone === 'granted') {
      return true;
    }
    if (requestInFlightRef.current) {
      return requestInFlightRef.current;
    }

    try {
      logger.info('Requesting media permissions...');

      requestInFlightRef.current = navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((stream) => {
          // Permissão concedida
          setMediaPermissions({ microphone: 'granted' });

          // Parar o stream imediatamente
          stream.getTracks().forEach((track) => track.stop());

          logger.info('Media permissions granted');

          addNotification({
            type: 'success',
            message: 'Microphone access granted',
            duration: 3000,
          });

          return true;
        });

      return await requestInFlightRef.current;
    } catch (error) {
      logger.error('Failed to request permissions:', error);
      
      setMediaPermissions({ microphone: 'denied' });

      addNotification({
        type: 'error',
        message: 'Microphone access denied. Please enable it in your browser settings.',
        duration: 5000,
      });
      return false;
    } finally {
      requestInFlightRef.current = null;
    }
  }, [mediaPermissions.microphone, setMediaPermissions, addNotification]);

  // Verificar permissões ao montar
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissions: mediaPermissions,
    checkPermissions,
    requestPermissions,
    hasMicrophonePermission: mediaPermissions.microphone === 'granted',
  };
}
