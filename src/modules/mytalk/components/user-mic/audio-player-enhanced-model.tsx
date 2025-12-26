import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAudioModel } from "../audio/audio.model";

interface UseAudioPlayerProps {
  src: string | Blob;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
}

export function useAudioPlayerModel({
  src,
  duration: providedDuration,
  onPlay,
  onPause,
}: UseAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const { state } = useAudioModel();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (src instanceof Blob) {
      const url = URL.createObjectURL(src);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioUrl(src);
    }
  }, [src]);

  // Set provided duration if available
  useEffect(() => {
    if (
      providedDuration &&
      isFinite(providedDuration) &&
      providedDuration > 0
    ) {
      setDuration(providedDuration);
      setIsLoading(false);
    }
  }, [providedDuration]);

  // Audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleLoadedMetadata = () => {
      // Only use audio metadata duration if no provided duration
      if (
        !providedDuration &&
        isFinite(audioElement.duration) &&
        audioElement.duration > 0
      ) {
        setDuration(audioElement.duration);
      }
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      console.error("Erro ao carregar áudio");
      setIsLoading(false);
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handleEnded);
    audioElement.addEventListener("canplay", handleCanPlay);
    audioElement.addEventListener("error", handleError);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("play", handlePlay);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("ended", handleEnded);
      audioElement.removeEventListener("canplay", handleCanPlay);
      audioElement.removeEventListener("error", handleError);
    };
  }, [audioUrl, onPlay, onPause, providedDuration]);

  const togglePlayPause = useCallback(async () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    try {
      if (isPlaying) {
        audioElement.pause();
      } else {
        await audioElement.play();
      }
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    }
  }, [isPlaying]);

  const handleProgressBarClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audioElement = audioRef.current;
      const progressBar = progressBarRef.current;
      if (!audioElement || !progressBar || duration <= 0) return;

      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;

      audioElement.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration],
  );

  const formatTime = useCallback((time: number) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";

    const minutes = Math.floor(Math.max(0, time) / 60);
    const seconds = Math.floor(Math.max(0, time) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const progress =
    duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0;
  const showLoading = isLoading || state.isSendingAudioMessage;

  return {
    // State
    isPlaying,
    currentTime,
    duration,
    isLoading,
    audioUrl,
    progress,
    showLoading,

    // Refs
    audioRef,
    progressBarRef,

    // Actions
    togglePlayPause,
    handleProgressBarClick,
    formatTime,
  };
}
