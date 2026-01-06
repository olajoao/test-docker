/**
 * Tipagens TypeScript para JsSIP
 * Baseado na biblioteca JsSIP 3.5.5
 */

// ==================== WebSocket Configuration ====================
export interface WebSocketConfiguration {
  uri: string;
  via_transport?: 'auto' | 'tcp' | 'tls' | 'ws' | 'wss';
  max_reconnection_attempts?: number;
  reconnection_timeout?: number;
}

// ==================== UA Configuration ====================
export interface UAConfiguration {
  uri: string;
  password: string;
  display_name?: string | null;
  sockets: WebSocketConfiguration[];
  registrar_server?: string | null;
  contact_uri?: string | null;
  authorization_user?: string | null;
  instance_id?: string | null;
  session_timers?: boolean;
  use_preloaded_route?: boolean;
  register?: boolean;
  register_expires?: number;
  connection_recovery_min_interval?: number;
  connection_recovery_max_interval?: number;
}

// ==================== PC Configuration ====================
export interface PCConfiguration {
  rtcpMuxPolicy?: 'negotiate' | 'require';
  iceServers?: RTCIceServer[];
}

// ==================== Call Options ====================
export interface CallOptions {
  mediaConstraints?: MediaStreamConstraints;
  pcConfig?: PCConfiguration;
  rtcConstraints?: RTCOfferOptions;
  rtcOfferConstraints?: RTCOfferOptions;
  sessionTimersExpires?: number;
  extraHeaders?: string[];
}

// ==================== Session Events ====================
export type SessionStatus = 
  | 'null'
  | 'invite_sent'
  | 'invite_received'
  | 'connecting'
  | 'progress'
  | 'early_media'
  | 'confirmed'
  | 'ended';

export interface SessionEventMap {
  progress: CustomEvent;
  accepted: CustomEvent;
  confirmed: CustomEvent;
  ended: CustomEvent<{ cause: string; originator: 'local' | 'remote' | 'system' }>;
  failed: CustomEvent<{ cause: string; originator: 'local' | 'remote' | 'system' }>;
  peerconnection: CustomEvent<{ peerconnection: RTCPeerConnection }>;
  icecandidate: CustomEvent<{ candidate: RTCIceCandidate; ready: () => void }>;
  newDTMF: CustomEvent<{ originator: 'local' | 'remote'; dtmf: { tone: string; duration: number } }>;
  newInfo: CustomEvent;
  hold: CustomEvent<{ originator: 'local' | 'remote' }>;
  unhold: CustomEvent<{ originator: 'local' | 'remote' }>;
  muted: CustomEvent<{ audio: boolean; video: boolean }>;
  unmuted: CustomEvent<{ audio: boolean; video: boolean }>;
  reinvite: CustomEvent;
  update: CustomEvent;
  refer: CustomEvent;
  replaces: CustomEvent;
  sdp: CustomEvent<{ originator: 'local' | 'remote'; type: 'offer' | 'answer'; sdp: string }>;
  getusermediafailed: CustomEvent;
  peerconnection_createofferfailed: CustomEvent;
  peerconnection_createanswerfailed: CustomEvent;
  peerconnection_setlocaldescriptionfailed: CustomEvent;
  peerconnection_setremotedescriptionfailed: CustomEvent;
}

// ==================== RTCSession Interface ====================
export interface RTCSession {
  id: string;
  direction: 'incoming' | 'outgoing';
  local_identity: { uri: string; display_name?: string };
  remote_identity: { uri: string; display_name?: string };
  start_time: Date | null;
  end_time: Date | null;
  status: SessionStatus;
  connection: RTCPeerConnection | null;
  
  // Methods
  answer(options?: CallOptions): void;
  terminate(options?: { status_code?: number; reason_phrase?: string; body?: string }): void;
  sendDTMF(tone: string, options?: { duration?: number; interToneGap?: number }): void;
  hold(options?: { useUpdate?: boolean }, done?: () => void): void;
  unhold(options?: { useUpdate?: boolean }, done?: () => void): void;
  renegotiate(options?: CallOptions, done?: () => void): void;
  refer(target: string, options?: any): void;
  mute(options?: { audio?: boolean; video?: boolean }): void;
  unmute(options?: { audio?: boolean; video?: boolean }): void;
  isMuted(): { audio: boolean; video: boolean };
  isOnHold(): { local: boolean; remote: boolean };
  isEnded(): boolean;
  isEstablished(): boolean;
  isInProgress(): boolean;
  
  // Event listeners
  on<K extends keyof SessionEventMap>(event: K, listener: (event: SessionEventMap[K]) => void): void;
  off<K extends keyof SessionEventMap>(event: K, listener: (event: SessionEventMap[K]) => void): void;
  removeAllListeners(): void;
}

// ==================== UA Events ====================
export interface UAEventMap {
  connecting: CustomEvent<{ socket: any; attempts: number }>;
  connected: CustomEvent<{ socket: any }>;
  disconnected: CustomEvent<{ socket: any; error: boolean; code?: number; reason?: string }>;
  registered: CustomEvent<{ response: any }>;
  unregistered: CustomEvent<{ response?: any; cause?: string }>;
  registrationFailed: CustomEvent<{ response?: any; cause?: string }>;
  registrationExpiring: CustomEvent;
  newRTCSession: CustomEvent<{ originator: 'local' | 'remote'; session: RTCSession; request: any }>;
  newMessage: CustomEvent;
  sipEvent: CustomEvent;
}

// ==================== UA Interface ====================
export interface UA {
  start(): void;
  stop(): void;
  register(): void;
  unregister(options?: { all?: boolean }): void;
  call(target: string, options?: CallOptions): RTCSession;
  isRegistered(): boolean;
  isConnected(): boolean;
  
  get(parameter: string): any;
  set(parameter: string, value: any): void;
  
  on<K extends keyof UAEventMap>(event: K, listener: (event: UAEventMap[K]) => void): void;
  off<K extends keyof UAEventMap>(event: K, listener: (event: UAEventMap[K]) => void): void;
  removeAllListeners(): void;
}

// ==================== Constructor ====================
export interface JsSIPConstructor {
  UA: new (configuration: UAConfiguration) => UA;
  WebSocketInterface: any;
  debug: {
    enable(namespace: string): void;
    disable(): void;
  };
}

declare global {
  interface Window {
    JsSIP: JsSIPConstructor;
  }
}

export type JsSIPType = JsSIPConstructor;
