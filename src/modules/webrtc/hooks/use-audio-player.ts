/**
 * Hook useAudioPlayer
 * Gerencia reprodução de sons do sistema WebRTC (ringback, ringing, answered, rejected)
 */

import { useEffect, useRef, useCallback } from 'react';
import { createLogger } from '../lib/logger';
import type { AudioType } from '../types';

const logger = createLogger('useAudioPlayer');

// Sons do WebRTC (usar MP3 para máxima compatibilidade entre navegadores)
const SOUNDS: Record<AudioType, string> = {
  ringback: '/sounds/webrtc/ringback.mp3',
  ringing: '/sounds/webrtc/ringing.mp3',
  answered: '/sounds/webrtc/answered.mp3',
  rejected: '/sounds/webrtc/rejected.mp3',
  moh: '/sounds/webrtc/moh.mp3', // Music On Hold
};

interface AudioPlayerConfig {
  ringback: { volume: number; loop: boolean };
  ringing: { volume: number; loop: boolean };
  answered: { volume: number; loop: boolean };
  rejected: { volume: number; loop: boolean };
  moh: { volume: number; loop: boolean };
}

const DEFAULT_CONFIG: AudioPlayerConfig = {
  ringback: { volume: 1.0, loop: true },
  ringing: { volume: 1.0, loop: true },
  answered: { volume: 1.0, loop: false },
  rejected: { volume: 0.5, loop: false },
  moh: { volume: 0.7, loop: true }, // Music On Hold em loop
};

// Criar elementos Audio como singleton (fora do componente para sobreviver ao StrictMode)
let audioElementsInitialized = false;
const audioElements: Record<AudioType, HTMLAudioElement> = {
  ringback: new Audio(),
  ringing: new Audio(),
  answered: new Audio(),
  rejected: new Audio(),
  moh: new Audio(),
};

// Inicializar elementos de áudio uma única vez
function initializeAudioElements() {
  if (audioElementsInitialized) return;
  
  logger.debug('Initializing audio elements (singleton)');
  
  Object.entries(SOUNDS).forEach(([name, src]) => {
    const audio = audioElements[name as AudioType];
    audio.src = src;
    audio.preload = 'auto';
    audio.loop = false;
    
    // Log para debug
    audio.addEventListener('canplaythrough', () => {
      logger.debug(`Audio ${name} loaded successfully from ${src}`);
    }, { once: true });
    
    audio.addEventListener('error', (e) => {
      const target = e.target as HTMLAudioElement;
      const error = target.error;
      
      let errorMsg = 'Unknown error';
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Download aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Decode error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Format not supported or file not found';
            break;
        }
        errorMsg += ` (code: ${error.code}, message: ${error.message || 'none'})`;
      }
      
      logger.error(`Failed to load audio ${name} from ${src}: ${errorMsg}`, e);
    });
  });
  
  audioElementsInitialized = true;
}

export function useAudioPlayer() {
  const audioRefs = useRef<Record<AudioType, HTMLAudioElement | null>>({
    ringback: null,
    ringing: null,
    answered: null,
    rejected: null,
  });

  const initialized = useRef(false);

  // Inicializar referências aos áudios singleton
  useEffect(() => {
    if (initialized.current) return;

    // Inicializar elementos singleton
    // Inicializar elementos singleton
    initializeAudioElements();

    // Referenciar os elementos singleton
    audioRefs.current = audioElements;

    // Para mobile: pré-carregar áudios com volume 0
    // Isso permite que os áudios sejam reproduzidos posteriormente
    if (isMobileBrowser()) {
      Object.entries(audioRefs.current).forEach(([, audio]) => {
        if (audio) {
          audio.volume = 0;
          audio.play().catch(() => {
            // Ignorar erros de autoplay
          });
        }
      });
    }

    initialized.current = true;

    // Cleanup: apenas pausar, não limpar src (causa erro no StrictMode)
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
        }
      });
      // Não resetar initialized.current aqui, pois queremos manter os áudios
    };
  }, []);

  // Play
  const play = useCallback((name: AudioType, relativeVolume = 1.0) => {
    if (!initialized.current) {
      logger.warn('Audio player not initialized yet');
      return;
    }

    logger.debug(`Playing sound: ${name} with volume: ${relativeVolume}`);

    const audio = audioRefs.current[name];
    if (!audio) {
      logger.error(`Audio not found: ${name}`);
      return;
    }

    try {
      // Configurar áudio
      audio.pause();
      audio.currentTime = 0;
      audio.volume = DEFAULT_CONFIG[name].volume * relativeVolume;
      audio.loop = DEFAULT_CONFIG[name].loop; // Configurar loop conforme config
      
      audio.play().catch((error) => {
        logger.warn(`Failed to play ${name}:`, error);
      });
    } catch (error) {
      logger.error(`Error playing ${name}:`, error);
    }
  }, []);

  // Stop
  const stop = useCallback((name: AudioType) => {
    logger.debug(`Stopping sound: ${name}`);

    const audio = audioRefs.current[name];
    if (!audio) {
      logger.error(`Audio not found: ${name}`);
      return;
    }

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      logger.error(`Error stopping ${name}:`, error);
    }
  }, []);

  // Stop all
  const stopAll = useCallback(() => {
    logger.debug('Stopping all sounds');

    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (error) {
          logger.error('Error stopping audio:', error);
        }
      }
    });
  }, []);

  return {
    play,
    stop,
    stopAll,
    isInitialized: initialized.current,
  };
}

// Helper: detectar mobile
function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
