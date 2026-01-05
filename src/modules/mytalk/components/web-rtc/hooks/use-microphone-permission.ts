import { useMicrophonePermission as useMicrophoneStore, checkMicrophonePermissions } from "@/modules/mytalk/stores/microphone-permission"

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useMicrophonePermission() {
  const [isChecking, setIsChecking] = useState(false);
  const { MICROPHONE_ACCESS, setMicrophonePermission } = useMicrophoneStore();

  const checkAndRequestPermission = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);

    // Se já temos permissão armazenada, verificar se ainda é válida
    if (MICROPHONE_ACCESS) {
      try {
        const isStillValid = await checkMicrophonePermissions();
        if (isStillValid) {
          setIsChecking(false);
          return true;
        }
      } catch (error) {
        console.log("Permissão anterior não é mais válida, solicitando novamente");
      }
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("A API de mídia não é suportada neste navegador.");
      setIsChecking(false);
      setMicrophonePermission(false);
      return false;
    }

    try {
      // Verificar status da permissão
      const permissionStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      if (permissionStatus.state === "granted") {
        setMicrophonePermission(true);
        setIsChecking(false);
        return true;
      }

      if (permissionStatus.state === "denied") {
        toast.warning(
          "O acesso ao microfone foi negado. Por favor, habilite nas configurações do seu navegador.",
        );
        setMicrophonePermission(false);
        setIsChecking(false);
        return false;
      }

      // Se for prompt, solicitar permissão
      if (permissionStatus.state === "prompt") {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        
        // Parar todas as tracks imediatamente
        stream.getTracks().forEach((track) => track.stop());
        
        toast.success("Acesso ao microfone permitido!");
        setMicrophonePermission(true);
        setIsChecking(false);
        return true;
      }
    } catch (err) {
      console.error("Erro ao solicitar permissão do microfone:", err);
      
      // Tentar método alternativo
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        
        toast.success("Acesso ao microfone permitido!");
        setMicrophonePermission(true);
        setIsChecking(false);
        return true;
      } catch (fallbackErr) {
        console.error("Erro no método alternativo:", fallbackErr);
        toast.error(
          "Não foi possível acessar o microfone. Verifique as permissões do navegador.",
        );
        setMicrophonePermission(false);
        setIsChecking(false);
        return false;
      }
    }

    setIsChecking(false);
    return false;
  }, [MICROPHONE_ACCESS, setMicrophonePermission]);

  return {
    isChecking,
    hasPermission: MICROPHONE_ACCESS,
    requestPermission: checkAndRequestPermission,
  };
}
