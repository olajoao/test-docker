/**
 * Sistema de logging moderno para o módulo WebRTC
 * Baseado no Logger.js original, adaptado para TypeScript
 */

const APP_NAME = 'webrtc-jssip';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
}

class Logger {
  private prefix: string;
  private config: LoggerConfig;

  constructor(prefix?: string) {
    this.prefix = prefix || '';
    this.config = {
      enabled: import.meta.env.DEV,
      level: 'debug',
    };
  }

  private formatMessage(level: LogLevel, ...args: any[]): void {
    if (!this.config.enabled) return;

    const timestamp = new Date().toISOString();
    const prefixStr = this.prefix ? `${APP_NAME}:${this.prefix}` : APP_NAME;
    const levelStr = level.toUpperCase();

    const message = `[${timestamp}] [${levelStr}] [${prefixStr}]`;

    switch (level) {
      case 'debug':
      case 'info':
        console.info(message, ...args);
        break;
      case 'warn':
        console.warn(message, ...args);
        break;
      case 'error':
        console.error(message, ...args);
        break;
    }
  }

  debug(...args: any[]): void {
    this.formatMessage('debug', ...args);
  }

  info(...args: any[]): void {
    this.formatMessage('info', ...args);
  }

  warn(...args: any[]): void {
    this.formatMessage('warn', ...args);
  }

  error(...args: any[]): void {
    this.formatMessage('error', ...args);
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

// Factory function para criar loggers com escopo
export function createLogger(prefix?: string): Logger {
  return new Logger(prefix);
}

// Logger padrão para o módulo
export const logger = new Logger();

export default Logger;
