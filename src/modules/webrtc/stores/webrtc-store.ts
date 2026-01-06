/**
 * Zustand Store para gerenciamento global do estado WebRTC
 * Centraliza configurações, conexão, chamadas e UI
 */

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import type { 
  WebRTCSettings, 
  ConnectionStatus, 
  CallState, 
  MediaPermissions,
  Notification,
  UA,
  RTCSession
} from '../types';
import { DEFAULT_SETTINGS } from '../types/settings';
import { deepMerge } from '../lib/utils';

// ==================== State Interface ====================
interface WebRTCState {
  // Configurações
  settings: WebRTCSettings;
  
  // Conexão
  connectionStatus: ConnectionStatus;
  ua: UA | null;
  isRegistered: boolean;
  
  // Chamadas
  activeCall: CallState | null;
  incomingCall: RTCSession | null;
  
  // UI
  showDialpad: boolean;
  notifications: Notification[];
  
  // Permissões
  mediaPermissions: MediaPermissions;
  
  // Nome do usuário
  displayName: string;
}

// ==================== Actions Interface ====================
interface WebRTCActions {
  // Settings
  setSettings: (settings: Partial<WebRTCSettings>) => void;
  resetSettings: () => void;
  loadSettingsFromWindow: () => void;
  
  // Connection
  setConnectionStatus: (status: ConnectionStatus) => void;
  setUA: (ua: UA | null) => void;
  setRegistered: (registered: boolean) => void;
  
  // Calls
  setActiveCall: (call: CallState | null | ((current: CallState | null) => CallState | null)) => void;
  setIncomingCall: (call: RTCSession | null) => void;
  updateCallDuration: (duration: number) => void;
  
  // UI
  toggleDialpad: () => void;
  setShowDialpad: (show: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Permissions
  setMediaPermissions: (permissions: Partial<MediaPermissions>) => void;
  
  // User
  setDisplayName: (name: string) => void;
  
  // Settings Validation
  isSettingsReady: () => boolean;
  
  // Reset
  reset: () => void;
}

// ==================== Initial State ====================
const initialState: WebRTCState = {
  settings: DEFAULT_SETTINGS,
  connectionStatus: 'disconnected',
  ua: null,
  isRegistered: false,
  activeCall: null,
  incomingCall: null,
  showDialpad: false,
  notifications: [],
  mediaPermissions: {
    microphone: 'unknown',
    camera: 'unknown',
  },
  displayName: '',
};

// ==================== Store ====================
export const useWebRTCStore = create<WebRTCState & WebRTCActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Settings Actions
        setSettings: (newSettings) => {
          set((state) => ({
            settings: deepMerge(state.settings, newSettings),
          }));
        },

        resetSettings: () => {
          set({ settings: DEFAULT_SETTINGS });
        },

        loadSettingsFromWindow: () => {
          if (typeof window !== 'undefined' && (window as any).SETTINGS) {
            set((state) => ({
              settings: deepMerge(state.settings, (window as any).SETTINGS as Partial<WebRTCSettings>),
            }));
          }
        },

        // Connection Actions
        setConnectionStatus: (status) => {
          set({ connectionStatus: status });
        },

        setUA: (ua) => {
          set({ ua });
        },

        setRegistered: (registered) => {
          set({ isRegistered: registered });
        },

        // Call Actions
        setActiveCall: (call) => {
          set((state) => ({
            activeCall: typeof call === 'function' ? call(state.activeCall) : call,
          }));
        },

        setIncomingCall: (call) => {
          set({ incomingCall: call });
        },

        updateCallDuration: (duration) => {
          set((state) => {
            if (!state.activeCall) return state;
            
            return {
              activeCall: {
                ...state.activeCall,
                duration,
              },
            };
          });
        },

        // UI Actions
        toggleDialpad: () => {
          set((state) => ({ showDialpad: !state.showDialpad }));
        },

        setShowDialpad: (show) => {
          set({ showDialpad: show });
        },

        addNotification: (notification) => {
          const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newNotification: Notification = {
            ...notification,
            id,
            timestamp: new Date(),
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto-remove após duração definida
          if (notification.duration) {
            setTimeout(() => {
              get().removeNotification(id);
            }, notification.duration);
          }
        },

        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },

        // Permission Actions
        setMediaPermissions: (permissions) => {
          set((state) => ({
            mediaPermissions: {
              ...state.mediaPermissions,
              ...permissions,
            },
          }));
        },

        // User Actions
        setDisplayName: (name) => {
          set({ displayName: name });
        },

        // Settings Validation
        isSettingsReady: () => {
          const { settings } = get();
          return Boolean(settings.uri && settings.socket?.uri);
        },

        // Reset
        reset: () => {
          set({
            ...initialState,
            settings: get().settings,  
          });
        },
      }),
      {
        name: 'settings',
        storage: createJSONStorage(() => ({
          getItem: (name) => {
            const value = localStorage.getItem(name);
            if (!value) return null;
            
            try {
              const parsed = JSON.parse(value);
              
              // Se é formato legacy (direto), envolver no formato Zustand
              if (parsed.uri || parsed.socket || parsed.display_name) {
                return JSON.stringify({
                  state: {
                    settings: parsed,
                    displayName: parsed.display_name || '',
                  },
                  version: 0,
                });
              }
              
              // Já é formato Zustand
              return value;
            } catch (e) {
              console.error('Custom storage getItem - parse error:', e);
              return null;
            }
          },
          setItem: (name, value) => {
            localStorage.setItem(name, value);
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        })),
        partialize: (state) => ({
          settings: state.settings,
          displayName: state.displayName,
        }),
        // Garantir que carregue do formato legacy ou Zustand
        merge: (persistedState: any, currentState) => {
          // Se não tem estado persistido, usar currentState
          if (!persistedState) {
            return currentState;
          }

          // Formato padrão do Zustand persist (já deve estar correto após getItem)
          return {
            ...currentState,
            settings: persistedState.settings || currentState.settings,
            displayName: persistedState.displayName || currentState.displayName,
          };
        },
      }
    ),
    { name: 'WebRTCStore' }
  )
);

// ==================== Selectors ====================
export const selectIsConnected = (state: WebRTCState & WebRTCActions) =>
  state.connectionStatus === 'connected' || state.connectionStatus === 'registered';

const isCallState = (value: unknown): value is CallState =>
  Boolean(value) && typeof value === 'object' && 'session' in (value as any);

export const selectHasActiveCall = (state: WebRTCState & WebRTCActions) =>
  isCallState(state.activeCall);

export const selectHasIncomingCall = (state: WebRTCState & WebRTCActions) =>
  state.incomingCall !== null;

export const selectCanMakeCall = (state: WebRTCState & WebRTCActions) =>
  state.isRegistered && !state.activeCall && !state.incomingCall;

export const selectCallState = (state: WebRTCState & WebRTCActions) => ({
  activeCall: state.activeCall,
  incomingCall: state.incomingCall,
  hasActiveCall: isCallState(state.activeCall),
  hasIncomingCall: state.incomingCall !== null,
});
