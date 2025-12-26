/**
 * Gerenciamento de LocalStorage para o módulo WebRTC
 * Migrado de storage.js para TypeScript
 */

import { createLogger } from './logger';

const logger = createLogger('storage');

// ==================== Generic Storage Helper ====================
export class Storage<T = any> {
  private key: string;
  
  constructor(key: string) {
    this.key = key;
  }

  get(): T | null {
    try {
      const data = localStorage.getItem(this.key);
      
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data) as T;
      logger.debug(`get() [key:${this.key}]`, parsed);
      
      return parsed;
    } catch (error) {
      logger.error(`get() [key:${this.key}] error:`, error);
      return null;
    }
  }

  set(value: T): void {
    try {
      logger.debug(`set() [key:${this.key}]`, value);
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      logger.error(`set() [key:${this.key}] error:`, error);
    }
  }

  clear(): void {
    try {
      logger.debug(`clear() [key:${this.key}]`);
      localStorage.removeItem(this.key);
    } catch (error) {
      logger.error(`clear() [key:${this.key}] error:`, error);
    }
  }

  exists(): boolean {
    return localStorage.getItem(this.key) !== null;
  }
}

// ==================== Settings Storage ====================
import type { WebRTCSettings } from '../types/settings';

export const settingsStorage = new Storage<WebRTCSettings>('settings');

// ==================== Session Storage ====================
export class SessionStorage<T = any> {
  private key: string;
  
  constructor(key: string) {
    this.key = key;
  }

  get(): T | null {
    try {
      const data = sessionStorage.getItem(this.key);
      
      if (!data) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`SessionStorage.get() [key:${this.key}] error:`, error);
      return null;
    }
  }

  set(value: T): void {
    try {
      sessionStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      logger.error(`SessionStorage.set() [key:${this.key}] error:`, error);
    }
  }

  clear(): void {
    try {
      sessionStorage.removeItem(this.key);
    } catch (error) {
      logger.error(`SessionStorage.clear() [key:${this.key}] error:`, error);
    }
  }

  exists(): boolean {
    return sessionStorage.getItem(this.key) !== null;
  }
}

// ==================== Utility Functions ====================
export function clearAllWebRTCStorage(): void {
  logger.info('Clearing all WebRTC storage');
  
  // Limpar todas as chaves relacionadas ao WebRTC
  const keysToRemove = [
    'webrtc-settings',
    'webrtc-session',
    'webrtc-call-history',
  ];

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

export function getStorageSize(): { localStorage: number; sessionStorage: number } {
  let localSize = 0;
  let sessionSize = 0;

  // Calcular tamanho do localStorage
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      localSize += localStorage[key].length + key.length;
    }
  }

  // Calcular tamanho do sessionStorage
  for (const key in sessionStorage) {
    if (sessionStorage.hasOwnProperty(key)) {
      sessionSize += sessionStorage[key].length + key.length;
    }
  }

  return {
    localStorage: localSize,
    sessionStorage: sessionSize,
  };
}

// ==================== Export Shortcuts ====================
export default {
  Storage,
  SessionStorage,
  settingsStorage,
  clearAllWebRTCStorage,
  getStorageSize,
};
