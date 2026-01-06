"use client"

import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioPlayerModel } from "../user-mic/audio-player-enhanced-model"

export interface AudioComponentProps {
  src: string | Blob
  duration?: number
  variant?: "default" | "own" | "chat"
  size?: "sm" | "md" | "lg"
  className?: string
  onPlay?: () => void
  onPause?: () => void
}

export function AudioComponent({
  src,
  duration: providedDuration,
  variant = "default",
  size = "md",
  className,
  onPlay,
  onPause,
}: AudioComponentProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    audioUrl,
    progress,
    showLoading,
    audioRef,
    progressBarRef,
    togglePlayPause,
    handleProgressBarClick,
    formatTime,
  } = useAudioPlayerModel({
    src,
    duration: providedDuration,
    onPlay,
    onPause,
  })

  // Define styles based on variant
  const styles = {
    default: {
      container: "bg-white text-gray-900",
      button: "bg-green-600 hover:bg-green-700",
      buttonIcon: "text-white",
      progress: "bg-gray-200",
      progressFill: "bg-green-600",
    },
    own: {
      container: "bg-green-600 text-white",
      button: "bg-white/20 hover:bg-white/30",
      buttonIcon: "text-white",
      progress: "bg-white/30",
      progressFill: "bg-white",
    },
    chat: {
      container: "bg-gray-100 text-gray-900",
      button: "bg-green-600 hover:bg-green-700",
      buttonIcon: "text-white",
      progress: "bg-gray-200",
      progressFill: "bg-green-600",
    },
  }

  const sizes = {
    sm: {
      container: "py-2 px-4 min-w-[280px]",
      button: "w-8 h-8",
      icon: "w-4 h-4",
      text: "text-xs",
    },
    md: {
      container: "py-4 px-6 min-w-[400px]",
      button: "w-10 h-10",
      icon: "w-5 h-5",
      text: "text-sm",
    },
    lg: {
      container: "py-5 px-7 min-w-[500px]",
      button: "w-12 h-12",
      icon: "w-6 h-6",
      text: "text-base",
    },
  }

  const currentStyle = styles[variant]
  const currentSize = sizes[size]

  return (
    <div
      className={cn("flex items-center gap-3 rounded-full", currentStyle.container, currentSize.container, className)}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        onClick={togglePlayPause}
        disabled={showLoading}
        className={cn(
          "flex items-center justify-center rounded-full transition-colors",
          currentStyle.button,
          currentSize.button,
          showLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        {showLoading ? (
          <div
            className={cn("border-2 border-current border-t-transparent rounded-full animate-spin", currentSize.icon)}
          />
        ) : isPlaying ? (
          <Pause className={cn(currentSize.icon, currentStyle.buttonIcon)} />
        ) : (
          <Play className={cn(currentSize.icon, "ml-0.5", currentStyle.buttonIcon)} />
        )}
      </button>

      <span className={cn("tabular-nums", currentSize.text, currentStyle.container)}>{formatTime(currentTime)}</span>

      <div className="flex-1 flex flex-col gap-1">
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          className={cn("h-1 rounded-full cursor-pointer", currentStyle.progress)}
        >
          <div
            className={cn("h-full rounded-full transition-all duration-100", currentStyle.progressFill)}
            style={{ width: `${progress}%`, maxWidth: "100%" }}
          />
        </div>
      </div>

      <span className={cn("tabular-nums", currentSize.text, currentStyle.container)}>{formatTime(duration)}</span>
    </div>
  )
}
