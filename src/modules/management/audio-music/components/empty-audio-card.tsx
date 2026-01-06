import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMp3Dropzone } from "../use-mp3-dropzone"

interface EmptyAudioCardProps {
  onClick?: () => void
  onDropFile?: (file: File) => void
}

export function EmptyAudioCard({ onClick, onDropFile }: EmptyAudioCardProps) {
  const { isDragOver, bind } = useMp3Dropzone({
    onFile: (file) => onDropFile?.(file),
  })

  return (
    <Card 
      className={cn(
        "p-4 flex flex-col items-center gap-3 border-dashed cursor-pointer transition-colors min-h-40",
        isDragOver && "border-primary"
      )}
      onClick={onClick}
      {...bind}
    >
      <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center">
        <Plus className="h-5 w-5 text-gray-400" />
      </div>

      <p className="text-sm text-center text-gray-500">
        Arraste o som ou clique para selecionar
      </p>
    </Card>
  )
}


