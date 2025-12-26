/**
 * Página WebRTC - Full Screen
 * Rota: /webrtc
 * 
 * Sistema de chamadas VoIP usando JsSIP
 */

import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Login, Phone } from '@/modules/webrtc/components';
import { useWebRTCStore } from '@/modules/webrtc/stores/webrtc-store';

export const Route = createFileRoute('/webrtc')({
  component: WebRTCFullPage,
});

function WebRTCFullPage() {
  const displayName = useWebRTCStore((state) => state.displayName);
  const settings = useWebRTCStore((state) => state.settings);
  const setDisplayName = useWebRTCStore((state) => state.setDisplayName);
  const setSettings = useWebRTCStore((state) => state.setSettings);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicialização
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).SETTINGS) {
      const mergedSettings = { ...settings, ...(window as any).SETTINGS };
      setSettings(mergedSettings);
    }
    
    const hasValidSettings = Boolean(settings.uri && settings.socket?.uri);
    
    if (hasValidSettings && displayName) {
      setIsLoggedIn(true);
    }
    
    setIsInitialized(true);
  }, []);

  const handleLogin = (name: string) => {
    setDisplayName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setDisplayName('');
    setIsLoggedIn(false);
  };

  if (!isInitialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Phone onExit={handleLogout} />
      )}
    </div>
  );
}
