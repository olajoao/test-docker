/**
 * Componente Login
 * Tela inicial onde o usuário informa seu nome para conectar ao sistema WebRTC
 * 
 * Migrado de: lib/components/Login.jsx
 * Mudanças principais:
 * - Class Component → Function Component
 * - Material-UI 0.20 → shadcn/ui
 * - Stylus → TailwindCSS
 * - State interno → Zustand store
 */

import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWebRTCStore } from '../stores/webrtc-store';
import { createLogger } from '../lib/logger';
import { Settings } from './settings';
import { Logo } from './logo';

const logger = createLogger('Login');

interface LoginProps {
  onLogin: (name: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const { displayName, setDisplayName } = useWebRTCStore();
  
  const [name, setName] = useState(displayName);
  const [nameError, setNameError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Validar se pode prosseguir
  const canPlay = (): boolean => {
    return name.trim().length > 0;
  };

  // Handler para mudança de nome
  const handleChangeName = (value: string) => {
    setName(value);
    setNameError(null);
  };

  // Handler para reset
  const handleClickReset = () => {
    logger.debug('handleClickReset()');
    
    // NÃO resetar settings - apenas limpar nome
    setName('');
    setNameError(null);
  };

  // Validar formulário e prosseguir
  const checkForm = () => {
    if (!canPlay()) {
      setNameError('Nome é obrigatório');
      return;
    }

    logger.debug('checkForm() - valid');

    // Salvar nome no store
    setDisplayName(name);

    // Callback para continuar (passa o nome)
    onLogin(name);
  };

  // Handler para submit do formulário
  const handleSubmit = (e: React.FormEvent) => {
    logger.debug('handleSubmit()');
    e.preventDefault();
    checkForm();
  };

  // Handler para click no botão de settings
  const handleClickSettings = () => {
    logger.debug('handleClickSettings()');
    setShowSettings(true);
  };

  // Handler para submit das settings
  const handleSettingsClose = () => {
    logger.debug('handleSettingsClose()');
    setShowSettings(false);
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
      {/* Logo */}
      <div className="mb-8">
        <Logo size="large" />
      </div>

      {/* Formulário */}
      <form 
        onSubmit={handleSubmit}
        className="relative flex-none min-h-[200px] w-[300px] mx-auto bg-white/90 rounded shadow-2xl p-8 flex flex-col items-center justify-center"
      >
        {/* Ícone de Settings */}
        <div className="absolute right-3 top-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClickSettings}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Campo de Nome */}
        <div className="w-full space-y-2">
          <Label htmlFor="display-name">Digite seu nome</Label>
          <Input
            id="display-name"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => handleChangeName(e.target.value)}
            className={nameError ? 'border-destructive' : ''}
            autoFocus
          />
          {nameError && (
            <p className="text-sm text-destructive">{nameError}</p>
          )}
        </div>

        {/* Botão Reset */}
        <Button
          type="button"
          variant="outline"
          onClick={handleClickReset}
          className="mt-5"
        >
          Limpar
        </Button>
      </form>

      {/* Botão Submit (Play) */}
      <div className="flex-none flex flex-col items-center justify-center mt-5 w-20 h-20 md:w-24 md:h-24">
        <button
          type="button"
          onClick={checkForm}
          disabled={!canPlay()}
          className={`
            w-full h-full rounded-full bg-linear-to-br from-green-400 to-blue-500 
            shadow-lg transition-all duration-500 
            flex items-center justify-center
            ${
              canPlay()
                ? 'hover:scale-110 hover:rotate-180 hover:shadow-2xl cursor-pointer opacity-100'
                : 'opacity-25 cursor-not-allowed'
            }
          `}
          aria-label="Start connection"
        >
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </button>
      </div>

      {/* Dialog de Settings */}
      {showSettings && (
        <Settings
          isOpen={showSettings}
          onClose={handleSettingsClose}
        />
      )}
    </div>
  );
}
