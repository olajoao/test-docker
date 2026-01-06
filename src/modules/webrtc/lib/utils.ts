/**
 * Utilitários gerais para o módulo WebRTC
 * Migrado de utils.js para TypeScript
 */

import { createLogger } from './logger';

const logger = createLogger('utils');

// ==================== Device Detection ====================
let mediaQueryDetectorElem: HTMLElement | null = null;

export function initializeUtils(): Promise<void> {
  logger.debug('initialize()');

  // Criar elemento detector de media query se não existir
  if (!mediaQueryDetectorElem) {
    mediaQueryDetectorElem = document.createElement('div');
    mediaQueryDetectorElem.id = 'webrtc-media-query-detector';
    mediaQueryDetectorElem.style.cssText = 'display: none;';
    
    // Adicionar classes para detecção via CSS
    mediaQueryDetectorElem.className = 'hidden md:block';
    
    document.body.appendChild(mediaQueryDetectorElem);
  }

  return Promise.resolve();
}

export function isDesktop(): boolean {
  if (!mediaQueryDetectorElem) {
    // Fallback: detectar por largura da tela
    return window.innerWidth > 768;
  }
  
  // Desktop: elemento tem offsetParent (está visível via media query)
  return Boolean(mediaQueryDetectorElem.offsetParent);
}

export function isMobile(): boolean {
  return !isDesktop();
}

// ==================== Number Formatting ====================
export function formatPhoneNumber(number: string): string {
  // Remove caracteres não numéricos
  const cleaned = number.replace(/[^\d+]/g, '');
  return cleaned;
}

export function sanitizePhoneNumber(number: string): string {
  // Remove espaços e caracteres especiais, mantém apenas dígitos, +, * e #
  return number.replace(/[^\d+*#]/g, '');
}

// ==================== URI Helpers ====================
export function generateRandomSipUri(domain = 'example.com'): string {
  const randomUser = Math.random().toString(36).substr(2, 8);
  return `sip:${randomUser}@${domain}`;
}

export function parseSipUri(uri: string): { user: string; domain: string } | null {
  const match = uri.match(/^sip:([^@]+)@(.+)$/);
  
  if (!match) {
    return null;
  }

  return {
    user: match[1],
    domain: match[2],
  };
}

export function extractDisplayName(uri: string, displayName?: string): string {
  if (displayName) {
    return displayName;
  }

  const parsed = parseSipUri(uri);
  return parsed ? parsed.user : uri;
}

// ==================== Time Helpers ====================
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// ==================== Deep Merge ====================
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T];
      const targetValue = output[key as keyof T];

      if (isObject(sourceValue) && isObject(targetValue)) {
        output[key as keyof T] = deepMerge(
          targetValue as Record<string, any>,
          sourceValue as Record<string, any>
        ) as T[keyof T];
      } else if (sourceValue !== undefined) {
        output[key as keyof T] = sourceValue as T[keyof T];
      }
    });
  }

  return output;
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// ==================== Debounce ====================
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

// ==================== Throttle ====================
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ==================== Random ID ====================
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== Clipboard ====================
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    logger.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// ==================== Browser Detection ====================
export function getBrowserInfo(): {
  name: string;
  version: string;
  isMobile: boolean;
} {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  const mobile = isMobile();

  // Detecção simples de browser
  if (ua.includes('Firefox')) {
    browserName = 'Firefox';
    browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Chrome')) {
    browserName = 'Chrome';
    browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Safari')) {
    browserName = 'Safari';
    browserVersion = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Edge')) {
    browserName = 'Edge';
    browserVersion = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
  }

  return {
    name: browserName,
    version: browserVersion,
    isMobile: mobile,
  };
}
