import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WebRTCButtonProps {
  onClick: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  disabled?: boolean;
}

export function WebRTCButton({
  onClick,
  onPositionChange,
  disabled = false,
}: WebRTCButtonProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  const remToPx = useCallback(
    (rem: number) => rem * Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
    []
  );

  const calculateInitialPosition = useCallback(() => {
    const buttonSize = remToPx(4);
    const padding = remToPx(1.25);
    const bottomOffset = remToPx(7.5);
    return {
      x: window.innerWidth - buttonSize - padding,
      y: window.innerHeight - buttonSize - bottomOffset,
    };
  }, [remToPx]);

  useLayoutEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  useLayoutEffect(() => {
    if (!position && windowSize.width && windowSize.height) {
      const initial = calculateInitialPosition();
      setPosition(initial);
      onPositionChange?.(initial);
    }
  }, [windowSize, position, calculateInitialPosition, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!position || disabled) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: e.clientX - position.x,
      posY: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const buttonSize = remToPx(4);
    const padding = remToPx(1.25);
    const newX = e.clientX - dragRef.current.posX;
    const newY = e.clientY - dragRef.current.posY;

    const maxX = window.innerWidth - buttonSize - padding;
    const maxY = window.innerHeight - buttonSize - padding;

    const constrained = {
      x: Math.max(padding, Math.min(maxX, newX)),
      y: Math.max(padding, Math.min(maxY, newY)),
    };

    setPosition(constrained);
    onPositionChange?.(constrained);
  };

  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    const dx = Math.abs(e.clientX - dragRef.current.startX);
    const dy = Math.abs(e.clientY - dragRef.current.startY);

    // Só dispara clique se não arrastou mais que 5px
    if (dx < 5 && dy < 5) {
      onClick();
    }
  };

  if (!position) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        cursor: "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <Button
        className={cn(
          "w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all",
          "transform hover:scale-105 active:scale-95",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        size="icon"
        disabled={disabled}
        title="Iniciar WebRTC"
      >
        <div className="flex flex-col items-center">
          <svg
            viewBox="0 0 42 52"
            style={{width: '40px', height: '38px' }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.3801 39.7957C23.3801 46.2927 19.1994 51.5601 14.0417 51.5601C8.88339 51.5601 4.70264 46.2927 4.70264 39.7957C4.70264 33.2986 8.88339 28.0313 14.0417 28.0313C19.1994 28.0313 23.3801 33.2986 23.3801 39.7957Z" fill="#FF6600"/>
            <path d="M41.8509 23.325C41.8509 29.8212 37.6701 35.0894 32.5124 35.0894C27.3541 35.0894 23.1733 29.8212 23.1733 23.325C23.1733 16.8279 27.3541 11.5598 32.5124 11.5598C37.6701 11.5598 41.8509 16.8279 41.8509 23.325Z" fill="#FFCC00"/>
            <path d="M19.0227 23.0652C19.0227 29.5614 14.842 34.8296 9.68363 34.8296C4.52666 34.8296 0.345215 29.5614 0.345215 23.0652C0.345215 16.5682 4.52666 11.3 9.68363 11.3C14.842 11.3 19.0227 16.5682 19.0227 23.0652Z" fill="#0089CC"/>
            <path d="M37.7002 39.7957C37.7002 46.2927 33.5194 51.5601 28.3604 51.5601C23.2034 51.5601 19.022 46.2927 19.022 39.7957C19.022 33.2986 23.2034 28.0313 28.3604 28.0313C33.5194 28.0313 37.7002 33.2986 37.7002 39.7957Z" fill="#009939"/>
            <path d="M30.437 12.6077C30.437 19.1048 26.2555 24.3721 21.0979 24.3721C15.9402 24.3721 11.7588 19.1048 11.7588 12.6077C11.7588 6.11065 15.9402 0.843334 21.0979 0.843334C26.2555 0.843334 30.437 6.11065 30.437 12.6077Z" fill="#BF0000"/>
            <path d="M23.1738 23.3252C23.1738 23.5727 23.1909 23.815 23.2033 24.0591C27.3457 22.8552 30.4373 18.1898 30.4373 12.606C30.4373 12.3585 30.4202 12.1153 30.4078 11.8713C26.2654 13.076 23.1738 17.7414 23.1738 23.3252Z" fill="#FC0007"/>
            <path d="M24.4067 29.1503C26.0162 32.6946 29.0407 35.0894 32.5143 35.0894C33.93 35.0894 35.267 34.6806 36.4698 33.97C34.861 30.4257 31.8365 28.0309 28.3623 28.0309C26.9465 28.0309 25.6096 28.4397 24.4067 29.1503Z" fill="#1CD306"/>
            <path d="M19.0229 39.7959C19.0229 42.6701 19.8431 45.3003 21.2027 47.3433C22.5609 45.3003 23.381 42.6701 23.381 39.7959C23.381 36.9216 22.5609 34.2914 21.2027 32.2484C19.8431 34.2914 19.0229 36.9216 19.0229 39.7959Z" fill="#0F7504"/>
            <path d="M5.98584 33.8658C7.1202 34.4833 8.36888 34.8291 9.68328 34.8291C13.1226 34.8291 16.1191 32.4809 17.7402 28.9943C16.6058 28.3769 15.3564 28.0319 14.0427 28.0319C10.6034 28.0319 7.60625 30.3802 5.98584 33.8658Z" fill="#0C5E87"/>
            <path d="M11.7997 11.614C11.7778 11.9417 11.7593 12.2711 11.7593 12.6065C11.7593 18.186 14.8461 22.8471 18.9837 24.0562C19.0049 23.7285 19.0234 23.399 19.0234 23.0644C19.0234 17.4849 15.9373 12.8221 11.7997 11.614Z" fill="#6B0001"/>
            <path d="M12.6715 38.3388H11.2106C9.92085 38.3388 8.87207 37.022 8.87207 35.4016V18.7442C8.87207 17.1238 9.92085 15.8061 11.2106 15.8061H29.5294C30.8192 15.8061 31.8673 17.1238 31.8673 18.7442V35.4016C31.8673 37.022 30.8192 38.3388 29.5294 38.3388H23.2887L10.7677 46.0708L12.6715 38.3388Z" fill="white"/>
          </svg>
        </div>
      </Button>
    </div>
  );
}

