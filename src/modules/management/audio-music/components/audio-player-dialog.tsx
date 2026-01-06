import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Volume2 } from "lucide-react"

type AudioPlayerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  src?: string | null
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function AudioPlayerDialog({ open, onOpenChange, title, description, src }: AudioPlayerDialogProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const canPlay = Boolean(src)

  const progressPercent = useMemo(() => {
    if (!duration) return 0
    return Math.min(100, Math.max(0, (currentTime / duration) * 100))
  }, [currentTime, duration])

  useEffect(() => {
    if (!open) {
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
    }
  }, [open])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
    const onLoaded = () => setDuration(audio.duration || 0)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("ended", onEnded)
    }
  }, [src, open])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !canPlay) return

    if (audio.paused) {
      await audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const seek = (next: number) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    audio.currentTime = next
    setCurrentTime(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || "Player de Áudio"}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 items-center">
          <Button type="button" size="icon" variant="ghost" onClick={toggle} disabled={!canPlay}>
            <span className="sr-only">Play/Pause</span>
            <div className="h-0 w-0 border-y-[7px] border-y-transparent border-l-[10px] border-l-foreground" style={{
              display: isPlaying ? "none" : "block",
            }} />
            <div
              className="h-4 w-4"
              style={{
                display: isPlaying ? "grid" : "none",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
              }}
            >
              <div className="h-4 bg-foreground" />
              <div className="h-4 bg-foreground" />
            </div>
          </Button>
             <div className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>


          <div className="flex-1">
            <div className="relative h-2 rounded-full bg-muted">
              <div className="absolute left-0 top-0 h-2 rounded-full bg-foreground" style={{ width: `${progressPercent}%` }} />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.01}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="absolute inset-0 h-2 w-full opacity-0 cursor-pointer"
                disabled={!canPlay}
              />
            </div>
         
          </div>

          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </div>

        <audio ref={audioRef} src={src || undefined} preload="metadata" />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
