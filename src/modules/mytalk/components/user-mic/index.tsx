import { MicIcon } from "@/components/icons/MicIcon"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAudioModel } from "../audio/audio.model"
import { AudioRecorderOptimized } from "./audio-recorder-optimized"

export function UserMic() {
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const { actions } = useAudioModel()

  const startRecording = () => {
    setIsRecordingAudio(true)
  }

  const handleSendAudio = () => {
    actions.handleSendAudio()
    setIsRecordingAudio(false)
  }

  const handleCancelAudio = () => {
    setIsRecordingAudio(false)
  }

  return (
    <div className="relative">
      <Button
        onClick={startRecording}
        variant="ghost"
        size="icon"
        className="cursor-pointer focus-within:bg-muted-foreground/20 focus:bg-muted-foreground/20"
      >
        <MicIcon className="dark:text-white w-6 h-6" />
      </Button>
      {isRecordingAudio && (
        <div className="h-[10rem] max-w-[calc(100dvw-299px)] fixed right-0 p-5 bg-zinc-100 dark:bg-zinc-900 w-full bottom-0 items-center justify-start gap-x-5 flex">
          <AudioRecorderOptimized onSendAudio={handleSendAudio} onCancel={handleCancelAudio} maxDuration={180} />
        </div>
      )}
    </div>
  )
}
