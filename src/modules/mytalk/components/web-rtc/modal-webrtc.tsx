import type React from "react";
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { sendSettingsToIframe } from "./hooks/webrtc-iframe-service";
import { WebRTCIcon } from "../icons/WebRTCIcon";
import { useAppToken } from "@/hooks/use-app-token";

interface FloatingWebRTCProps {
  isOpen: boolean;
  onClose: () => void;
  buttonPosition?: { x: number; y: number } | null;
}

export function FloatingWebRTC({
  isOpen,
  onClose,
  buttonPosition,
}: FloatingWebRTCProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const dragRef = useRef<{ startX: number; startY: number }>({
    startX: 0,
    startY: 0,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { appToken } = useAppToken()

  const containerRef = useRef<HTMLDivElement>(null);

  // const WEBRTC_IFRAME_URL = appToken?.settings.webrtc_url; 
  const WEBRTC_IFRAME_URL =  "http://localhost:5173/webrtc"; 

  // Função para converter rem para px
  const remToPx = useCallback((rem: number) => {
    return (
      rem *
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }, []);

  // Função para calcular dimensões responsivas
  const getResponsiveDimensions = useCallback(() => {
    const width = windowSize.width;
    const height = windowSize.height;

    // Dimensões baseadas no tamanho da tela
    if (width < 768) {
      // Mobile
      return {
        width: Math.min(remToPx(18.75), width - remToPx(2)), // 300px ou largura - 32px
        height: Math.min(remToPx(32.5), height - remToPx(4)), // 520px ou altura - 64px
      };
    } else if (width < 1024) {
      // Tablet
      return {
        width: remToPx(20), // 316px
        height: remToPx(33), // 524px
      };
    } else {
      // Desktop
      return {
        width: remToPx(22), // 352px
        height: remToPx(33), // 524px
      };
    }
  }, [windowSize, remToPx]);

  // Função para calcular posição inicial
  const calculateInitialPosition = useCallback(() => {
    if (!windowSize.width || !windowSize.height) return null;

    const dimensions = getResponsiveDimensions();
    const padding = remToPx(1.25); // 20px de padding das bordas

    let initialX: number;
    let initialY: number;

    if (buttonPosition) {
      // Posicionar sobre o botão inicialmente
      const buttonSize = remToPx(4); // 64px (tamanho do botão)
      initialX = buttonPosition.x - dimensions.width + buttonSize;
      initialY = buttonPosition.y - dimensions.height - remToPx(0.625); // 10px acima do botão

      // Garantir que não saia da tela
      initialX = Math.max(
        padding,
        Math.min(windowSize.width - dimensions.width - padding, initialX),
      );
      initialY = Math.max(
        padding,
        Math.min(windowSize.height - dimensions.height - padding, initialY),
      );
    } else {
      // Posição padrão: canto inferior direito
      initialX = windowSize.width - dimensions.width - padding;
      initialY = windowSize.height - dimensions.height - remToPx(6.25); // 100px do bottom
    }

    return { x: initialX, y: initialY };
  }, [windowSize, buttonPosition, getResponsiveDimensions, remToPx]);

  // Atualizar tamanho da janela
  useLayoutEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  // Definir posição inicial quando a janela abrir
  useEffect(() => {
    if (isOpen && windowSize.width && windowSize.height && position === null) {
      const initialPos = calculateInitialPosition();
      if (initialPos) {
        setPosition(initialPos);
      }
    }
  }, [isOpen, windowSize, position, calculateInitialPosition]);

  // Reset loading state quando abrir
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  // Reposicionar quando minimizar/maximizar
  useEffect(() => {
    if (position && windowSize.width && windowSize.height) {
      const dimensions = getResponsiveDimensions();
      const padding = remToPx(1.25);

      // Verificar se a posição atual ainda é válida
      const maxX = windowSize.width - dimensions.width - padding;
      const maxY = windowSize.height - dimensions.height - padding;

      const newX = Math.max(padding, Math.min(maxX, position.x));
      const newY = Math.max(padding, Math.min(maxY, position.y));

      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY });
      }
    }
  }, [windowSize, position, getResponsiveDimensions, remToPx]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!position) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };
    e.preventDefault();
  };

  // Efeito para o arraste
  useEffect(() => {
    if (!isDragging || !position || !windowSize.width) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const dimensions = getResponsiveDimensions();
      const padding = remToPx(1.25);

      const newX = e.clientX - dragRef.current.startX;
      const newY = e.clientY - dragRef.current.startY;

      const maxX = windowSize.width - dimensions.width - padding;
      const maxY = windowSize.height - dimensions.height - padding;

      setPosition({
        x: Math.max(padding, Math.min(maxX, newX)),
        y: Math.max(padding, Math.min(maxY, newY)),
      });
    };

    const handleGlobalMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, position, windowSize, getResponsiveDimensions, remToPx]);

  /**
   * Callback executado quando o iframe termina de carregar.
   * Ele envia as configurações do WebRTC para o iframe.
   * Usamos useCallback para garantir que a função não seja recriada desnecessariamente.
   */
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    console.log("[FloatingWebRTC] Estado de loading desativado.");

    if (!iframeRef.current) {
      console.error(
        "[FloatingWebRTC] Erro: A referência do iframe é nula no momento do envio.",
      );
      return;
    }

    sendSettingsToIframe(iframeRef.current, appToken?.settings ?? null);
  }, [appToken?.settings]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "MICROPHONE_PERMISSION_REQUEST") {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            if (event.source && 'postMessage' in event.source) {
              (event.source as Window).postMessage({ type: "MICROPHONE_PERMISSION_GRANTED" }, "*");
            }
          })
          .catch(() => {
            if (event.source && 'postMessage' in event.source) {
              (event.source as Window).postMessage(
                { type: "MICROPHONE_PERMISSION_DENIED" },
                "*"
              );
            }
          })
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  if (!isOpen || !position) {
    return null;
  }

  const dimensions = getResponsiveDimensions();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        ref={containerRef}
        className="absolute pointer-events-auto transition-all duration-300 ease-in-out"
        style={{
          left: position.x,
          top: position.y,
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <Card className="w-full h-full shadow-2xl overflow-hidden flex flex-col ">
          {/* Cabeçalho */}
          <div
            className={cn(
              "absolute z-30 inset-x-0 overflow-clip rounded-t-lg flex items-center justify-end bg-transparent px-2 py-1 text-white select-none transition-colors",
              isDragging
                ? "cursor-grabbing"
                : "cursor-grab",
            )}
            onMouseDown={handleMouseDown}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-black cursor-pointer"
              onClick={onClose}
              title="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Container do Iframe */}
          <div
            className={cn(
              "flex-grow bg-gray-50 relative",
            )}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white">
                <div className="w-48 h-32">
                  <WebRTCIcon />
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              key={isOpen ? "webrtc-iframe-visible" : "webrtc-iframe-hidden"}
              src={WEBRTC_IFRAME_URL}
              className="w-full h-full border-0"
              title="WebRTC Interface"
              allow="microphone *; camera *; display-capture *; fullscreen *; autoplay *; encrypted-media *; geolocation *"
              onLoad={handleIframeLoad}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-modals"
            />
          </div>
        </Card>
        {isDragging && (
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            Arraste para mover
          </div>
        )}
      </div>
    </div>
  );
}
