/**
 * Hook useLocalStorage
 * Wrapper tipado para localStorage com sincronização de estado
 */

import { useState, useEffect, useCallback } from 'react';
import { createLogger } from '../lib/logger';

const logger = createLogger('useLocalStorage');

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para salvar no localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Permitir que value seja uma função para API consistente com useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Salvar no state
        setStoredValue(valueToStore);

        // Salvar no localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          logger.debug(`Saved to localStorage: ${key}`);
        }
      } catch (error) {
        logger.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Função para remover do localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        logger.debug(`Removed from localStorage: ${key}`);
      }
    } catch (error) {
      logger.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sincronizar com mudanças em outras tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          logger.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}
