import { Send, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAudioRecorderModel } from "./audio-recorder-optimized-model"

interface AudioRecorderOptimizedProps {
  onSendAudio?: () => void
  onCancel?: () => void
  className?: string
  maxDuration?: number
}

export function AudioRecorderOptimized({
  onSendAudio,
  onCancel,
  className,
  maxDuration = 300,
}: AudioRecorderOptimizedProps) {
  const {
    error,
    time,
    formattedTime,
    stopRecording,
    handleDiscard,
  } = useAudioRecorderModel({
    maxDuration,
    onSendAudio,
    onCancel,
  })

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-lg">
        <span className="text-sm">{error}</span>
        <button onClick={onCancel} className="ml-auto">
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div className="flex flex-col">
        <div className="flex items-center gap-4 p-4">
          <div className="flex-1 text-center border shadow-lg bg-white py-4 px-6 rounded-full">
            <div className="text-lg font-mono flex items-center gap-4 text-gray-900 tabular-nums">
              <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse" />
              {formattedTime} <p className="text-sm"> {time >= maxDuration ? "Finalizado" : "Gravando..."}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleDiscard} variant="outline" size="icon">
              <Trash2 className={cn("h-5 w-5 hover:text-red-600")} />
            </Button>

            <Button onClick={stopRecording} 
              variant="outline" size="icon">
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
