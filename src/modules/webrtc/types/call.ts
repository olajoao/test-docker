/**
 * Tipagens para estados e gerenciamento de chamadas
 */

import type { RTCSession } from './jssip';

// ==================== Connection Status ====================
export type ConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'registered';

// ==================== Call Direction ====================
export type CallDirection = 'incoming' | 'outgoing';

// ==================== Call Status ====================
export type CallStatus = 
  | 'idle'
  | 'ringing'
  | 'progress'
  | 'answered'
  | 'confirmed'
  | 'held'
  | 'ended'
  | 'failed';

// ==================== Call State ====================
export interface CallState {
  id: string;
  direction: CallDirection;
  session: RTCSession;
  status: CallStatus;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startTime: Date | null;
  endTime: Date | null;
  duration: number;
  isHeld: boolean;
  isMuted: boolean;
  displayName: string;
  uri: string;
}

// ==================== Audio State ====================
export type AudioType = 'ringback' | 'ringing' | 'answered' | 'rejected' | 'moh';

export interface AudioState {
  ringback: HTMLAudioElement | null;
  ringing: HTMLAudioElement | null;
  answered: HTMLAudioElement | null;
  rejected: HTMLAudioElement | null;
}

// ==================== Notification Type ====================
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  duration?: number;
}

// ==================== Media Permissions ====================
export type MediaPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

export interface MediaPermissions {
  microphone: MediaPermissionStatus;
  camera: MediaPermissionStatus;
}

// ==================== Device Info ====================
export interface DeviceInfo {
  isMobile: boolean;
  isDesktop: boolean;
  userAgent: string;
}

// ==================== DTMF Tone ====================
export type DTMFTone = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '*' | '#';

// ==================== Call Statistics ====================
export interface CallStatistics {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  rejectedCalls: number;
  failedCalls: number;
  averageDuration: number;
}

// ==================== Session Info ====================
export interface SessionInfo {
  localIdentity: {
    uri: string;
    displayName: string;
  };
  remoteIdentity: {
    uri: string;
    displayName: string;
  };
  direction: CallDirection;
  startTime: Date | null;
  endTime: Date | null;
}

// ==================== Call End Cause ====================
export interface CallEndCause {
  cause: string;
  originator: 'local' | 'remote' | 'system';
}

// ==================== Helper Functions ====================
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getDisplayName(identity: { uri: string; display_name?: string }): string {
  return identity.display_name || identity.uri.replace(/^sip:/, '').split('@')[0];
}

export function generateCallId(): string {
  return `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
