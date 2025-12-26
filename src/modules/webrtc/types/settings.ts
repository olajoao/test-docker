/**
 * Tipagens para configurações do sistema WebRTC
 */

import type { WebSocketConfiguration, PCConfiguration } from './jssip';

// ==================== Callstats Configuration ====================
export interface CallstatsConfiguration {
  enabled: boolean;
  AppID: string | null;
  AppSecret: string | null;
}

// ==================== WebRTC Settings ====================
export interface WebRTCSettings {
  display_name: string | null;
  uri: string | null;
  password: string | null;
  socket: WebSocketConfiguration;
  registrar_server: string | null;
  contact_uri: string | null;
  authorization_user: string | null;
  instance_id: string | null;
  session_timers: boolean;
  use_preloaded_route: boolean;
  pcConfig: PCConfiguration;
  callstats: CallstatsConfiguration;
}

// ==================== Default Settings ====================
export const DEFAULT_SETTINGS: WebRTCSettings = {
  display_name: null,
  uri: null,
  password: null,
  socket: {
    uri: 'wss://tryit.jssip.net:10443',
    via_transport: 'auto',
  },
  registrar_server: null,
  contact_uri: null,
  authorization_user: null,
  instance_id: null,
  session_timers: true,
  use_preloaded_route: false,
  pcConfig: {
    rtcpMuxPolicy: 'negotiate',
  },
  callstats: {
    enabled: false,
    AppID: null,
    AppSecret: null,
  },
};

// ==================== Settings Validation ====================
export interface SettingsValidation {
  isValid: boolean;
  errors: string[];
}

export function validateSettings(settings: WebRTCSettings): SettingsValidation {
  const errors: string[] = [];

  if (!settings.uri) {
    errors.push('URI is required');
  }

  if (!settings.password) {
    errors.push('Password is required');
  }

  if (!settings.socket.uri) {
    errors.push('WebSocket URI is required');
  }

  // Validação de formato de URI
  if (settings.uri && !settings.uri.startsWith('sip:')) {
    errors.push('URI must start with "sip:"');
  }

  // Validação de WebSocket URI
  if (settings.socket.uri && !settings.socket.uri.match(/^wss?:\/\//)) {
    errors.push('WebSocket URI must start with "ws://" or "wss://"');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==================== Window Settings Injection ====================
declare global {
  interface Window {
    SETTINGS?: Partial<WebRTCSettings>;
  }
}
