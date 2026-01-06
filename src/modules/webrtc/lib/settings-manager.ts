/**
 * Settings Manager - Gerenciamento de configurações WebRTC
 * Segue o padrão do settingsManager.js original
 * 
 * Funcionalidades:
 * - Carrega configurações do localStorage (chave 'settings')
 * - Faz merge com window.SETTINGS se existir
 * - Escuta mensagens de atualização de configurações via postMessage
 * - Recarrega a página quando configurações mudam
 */

import { deepMerge } from './utils';
import { createLogger } from './logger';
import { DEFAULT_SETTINGS } from '../types/settings';
import type { WebRTCSettings } from '../types/settings';

const logger = createLogger('settings-manager');

const STORAGE_KEY = 'settings';
const DEFAULT_SIP_DOMAIN = 'tryit.jssip.net';

// ==================== Storage Helpers ====================
function getSettingsFromStorage(): WebRTCSettings | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Formato Zustand persist: { state: { settings, displayName }, version: 0 }
    if (parsed.state && parsed.state.settings) {
      return parsed.state.settings;
    }
    
    // Formato direto (legacy/compatibilidade com código antigo)
    // Se tem propriedades de settings diretamente no objeto
    if (parsed.uri || parsed.socket || parsed.display_name) {
      logger.debug('Loading settings from legacy format (direct JSON)');
      return parsed;
    }
    
    return null;
  } catch (error) {
    logger.error('Error reading settings from localStorage:', error);
    return null;
  }
}

function getDisplayNameFromStorage(): string {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return '';
    
    const parsed = JSON.parse(data);
    
    // Formato Zustand persist
    if (parsed.state && parsed.state.displayName) {
      return parsed.state.displayName;
    }
    
    // Formato direto - usar display_name
    if (parsed.display_name) {
      return parsed.display_name;
    }
    
    return '';
  } catch (error) {
    return '';
  }
}

function saveSettingsToStorage(settings: WebRTCSettings, displayName: string = ''): void {
  try {
    // Ler o estado atual completo do Zustand
    const currentData = localStorage.getItem(STORAGE_KEY);
    let zustandData: any = {
      state: {
        settings,
        displayName,
      },
      version: 0,
    };

    // Se já existe dados do Zustand, preservar displayName
    if (currentData) {
      try {
        const parsed = JSON.parse(currentData);
        if (parsed.state) {
          zustandData.state.displayName = parsed.state.displayName || displayName;
        }
      } catch (e) {
        // Ignorar erro de parse
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(zustandData));
  } catch (error) {
    logger.error('Error saving settings to localStorage:', error);
  }
}

function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    logger.error('Error clearing storage:', error);
  }
}

// ==================== Settings Manager ====================
class SettingsManager {
  private settings: WebRTCSettings;

  constructor() {
    // Carregar do localStorage ou usar padrão
    let storedSettings = getSettingsFromStorage();
    
    if (!storedSettings) {
      logger.debug('Nenhuma configuração no localStorage. Usando configuração padrão.');
      this.settings = { ...DEFAULT_SETTINGS };
      // NÃO salvar automaticamente - deixar o Zustand persist gerenciar
    } else {
      logger.debug('Configurações carregadas do localStorage:', storedSettings);
      this.settings = storedSettings;
    }

    // Aplicar window.SETTINGS se existir
    if (typeof window !== 'undefined' && (window as any).SETTINGS) {
      logger.debug('window.SETTINGS encontrado. Realizando merge.');
      this.settings = deepMerge(this.settings, (window as any).SETTINGS);
    }

    // Inicializar listener de mensagens
    this.initializeSettingsListener();
  }

  /**
   * Listener para mensagens de atualização de configurações
   * Compatível com o padrão do settingsManager original
   */
  private initializeSettingsListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('message', (event) => {
      const { data } = event;

      if (data && typeof data === 'object' && data.type === 'webrtc-settings') {
        const receivedSettings = data.payload as WebRTCSettings;
        const currentSettings = this.get();

        logger.debug('localStorage atual vs recebido:', currentSettings, receivedSettings);

        const isDifferent = JSON.stringify(currentSettings) !== JSON.stringify(receivedSettings);

        if (isDifferent) {
          logger.debug('Configurações diferentes recebidas. Atualizando e recarregando.');
          this.set(receivedSettings);
          window.location.reload();
        } else {
          logger.debug('Configurações recebidas são iguais às atuais. Nenhuma ação necessária.');
        }
      }
    });
  }

  /**
   * Obtém as configurações atuais
   */
  get(): WebRTCSettings {
    return this.settings;
  }

  /**
   * Define novas configurações e persiste no localStorage
   */
  set(newSettings: WebRTCSettings): void {
    this.settings = newSettings;
    saveSettingsToStorage(newSettings);
  }

  /**
   * Limpa configurações e restaura padrão
   */
  clear(): void {
    clearStorage();
    this.settings = { ...DEFAULT_SETTINGS };
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  /**
   * Verifica se as configurações estão prontas para uso
   */
  isReady(): boolean {
    return Boolean(this.settings.uri);
  }

  /**
   * Retorna o domínio SIP padrão
   */
  getDefaultDomain(): string {
    return DEFAULT_SIP_DOMAIN;
  }
}

// Exportar instância singleton
export const settingsManager = new SettingsManager();

// Exportar classe para testes
export { SettingsManager };
