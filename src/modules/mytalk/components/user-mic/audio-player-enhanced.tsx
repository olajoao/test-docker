import { AudioComponent } from "../audio/audio-component"

interface AudioPlayerEnhancedProps {
  src: string | Blob
  duration?: number
  isOwn?: boolean
  className?: string
  onPlay?: () => void
  onPause?: () => void
}

export function AudioPlayerEnhanced({
  src,
  duration,
  isOwn = false,
  className,
  onPlay,
  onPause,
}: AudioPlayerEnhancedProps) {
  return (
    <AudioComponent
      src={src}
      duration={duration}
      variant={isOwn ? "own" : "default"}
      size="md"
      className={className}
      onPlay={onPlay}
      onPause={onPause}
    />
  )
}
