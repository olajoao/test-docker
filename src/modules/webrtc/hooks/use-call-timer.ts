/**
 * Hook useCallTimer
 * Gerencia o timer de duração de uma chamada ativa
 */

import { useEffect, useState } from 'react';
import { useWebRTCStore } from '../stores/webrtc-store';

export function useCallTimer() {
  const { activeCall, updateCallDuration } = useWebRTCStore();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!activeCall || !activeCall.startTime) {
      setDuration(0);
      return;
    }

    // Calcular duração inicial
    const startTime = activeCall.startTime.getTime();
    const initialDuration = Math.floor((Date.now() - startTime) / 1000);
    setDuration(initialDuration);

    // Atualizar a cada segundo
    const interval = setInterval(() => {
      const currentDuration = Math.floor((Date.now() - startTime) / 1000);
      setDuration(currentDuration);
      updateCallDuration(currentDuration);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCall, updateCallDuration]);

  return duration;
}
