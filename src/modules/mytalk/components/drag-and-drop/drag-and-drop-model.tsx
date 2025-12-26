import type React from "react"

import { useState, useCallback, useRef } from "react"
import { toast } from "sonner"
import { Fragment } from "react"

interface UseDragAndDropModelProps {
  onFilesDropped?: (files: FileList) => void
}

export function useDragAndDropModel({ onFilesDropped }: UseDragAndDropModelProps = {}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggedFiles, setDraggedFiles] = useState<File[]>([])
  const dragCounter = useRef(0)

  const isValidFileType = useCallback((file: File) => {
    const allowedTypes = [
      // Imagens
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Vídeos
      "video/mp4",
      "video/3gpp",
      "video/quicktime",
      "video/webm",
      "video/ogg",
      // Documentos
      "application/pdf",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      // Áudio
      "audio/mpeg", // mp3
    ]

    return allowedTypes.includes(file.type)
  }, [])

  const isValidFileSize = useCallback((file: File) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    return file.size <= MAX_FILE_SIZE
  }, [])

  const filterValidFiles = useCallback(
    (files: FileList) => {
      const validFiles: File[] = []
      const invalidFiles: { file: File; reason: string }[] = []
  
      Array.from(files).forEach((file) => {
        if (!isValidFileType(file)) {
          invalidFiles.push({ file, reason: "Tipo de arquivo não suportado" })
        } else if (!isValidFileSize(file)) {
          invalidFiles.push({ file, reason: "Arquivo muito grande (máx. 5MB)" })
        } else {
          validFiles.push(file)
        }
      })
  
      if (invalidFiles.length > 0) {
        const invalidByType = invalidFiles.filter((f) => f.reason === "Tipo de arquivo não suportado")
        const invalidBySize = invalidFiles.filter((f) => f.reason === "Arquivo muito grande (máx. 5MB)")
  
        toast.warning("", {
          position: "top-right",
          duration: 4000,
          description: (
            <div className="whitespace-pre-wrap text-left">
              {invalidByType.length > 0 && (
                <Fragment>
                  <strong>Arquivos com tipo não suportado:</strong>
                  <ul className="ml-4 list-disc">
                    {invalidByType.map((f) => (
                      <li key={f.file.name}>{f.file.name}</li>
                    ))}
                  </ul>
                </Fragment>
              )}
              {invalidBySize.length > 0 && (
                <Fragment>
                  <br />
                  <strong>Arquivos muito grandes:</strong>
                  <ul className="ml-4 list-disc">
                    {invalidBySize.map((f) => (
                      <li key={f.file.name}>{f.file.name}</li>
                    ))}
                  </ul>
                </Fragment>
              )}
            </div>
          ),
        })
      }
  
      return validFiles
    },
    [isValidFileType, isValidFileSize],
  )

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current++

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)

      const files: File[] = []
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i]
        if (item.kind === "file") {
          try {
            const file = item.getAsFile()
            if (file) files.push(file)
          } catch (error) {
          }
        }
      }
      setDraggedFiles(files)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current--

    if (dragCounter.current === 0) {
      setIsDragOver(false)
      setDraggedFiles([])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsDragOver(false)
      setDraggedFiles([])
      dragCounter.current = 0

      const files = e.dataTransfer.files

      if (files.length > 0) {
        const validFiles = filterValidFiles(files)

        if (validFiles.length > 0) {
          const dataTransfer = new DataTransfer()
          validFiles.forEach((file) => dataTransfer.items.add(file))

          onFilesDropped?.(dataTransfer.files)
        }
      }
    },
    [onFilesDropped, filterValidFiles],
  )

  return {
    isDragOver,
    draggedFiles,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  }
}
