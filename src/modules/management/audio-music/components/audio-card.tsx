import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, SquarePen, Trash2 } from "lucide-react"

interface AudioCardProps {
  fileName: string
  onDownload?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onPlay?: () => void
}

export function AudioCard({ fileName, onDownload, onDelete, onEdit, onPlay }: AudioCardProps) {

  return (
    <>
    <Card className="p-4 flex flex-col items-center gap-3 relative">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-6 w-6 text-white bg-red-600 hover:bg-red-400 hover:text-white"
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.()
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div
        role="button"
        tabIndex={0}
        className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          onPlay?.()
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onPlay?.()
          }
        }}
      >
          <svg className="h-5 w-5 text-blue-600"  width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.78297 3.28943C8.26099 4.44033 9 5.01578 9 6C9 6.98422 8.26099 7.55967 6.78296 8.71057C6.37495 9.02828 5.97027 9.32741 5.5984 9.57667C5.27216 9.79534 4.90269 10.0215 4.52016 10.2436C3.0456 11.0995 2.30833 11.5275 1.64707 11.0537C0.985814 10.5798 0.925717 9.58791 0.805524 7.60407C0.771533 7.04304 0.75 6.49305 0.75 6C0.75 5.50695 0.771533 4.95696 0.805524 4.39593C0.925718 2.41209 0.985814 1.42017 1.64707 0.946349C2.30833 0.472524 3.0456 0.900487 4.52016 1.75641C4.90269 1.97846 5.27216 2.20466 5.5984 2.42333C5.97027 2.67259 6.37495 2.97172 6.78297 3.28943Z" stroke="#0084D1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
      </div>

      <p className="text-sm text-center font-medium truncate w-full">{fileName}</p>

      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full border border-gray-300   hover:bg-gray-100"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full border border-gray-300   hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.()
          }}
        >
          <SquarePen className="h-4 w-4" />
        </Button>
      </div>
    </Card>
    </>
  )
}
