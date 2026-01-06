import type React from "react"

import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"
import { useDragAndDropModel } from "./drag-and-drop-model"

interface DragAndDropProps {
  children: React.ReactNode
  className?: string
  onFilesDropped?: (files: FileList) => void
}

export function DragAndDrop({ children, className, onFilesDropped }: DragAndDropProps) {
  const { isDragOver, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
    useDragAndDropModel({ onFilesDropped })


  return (
    <div
      className={cn("relative", className)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}

      {isDragOver && (
        <div className="absolute inset-0 bg-blue-600/20 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center p-6 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg">
          
                <div className="flex justify-center mb-4">
                  <FileIcon className="w-12 h-12 text-blue-500" />
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">Arraste arquivos aqui</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Imagens, vídeos ou documentos</p>
          </div>
        </div>
      )}
    </div>
  )
}
