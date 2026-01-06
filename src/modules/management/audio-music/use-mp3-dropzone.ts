import { useCallback, useRef, useState, type DragEvent } from "react"
import { toast } from "sonner"
import { isMp3 } from "./utils"

type UseMp3DropzoneParams = {
  onFile: (file: File) => void
}

export function useMp3Dropzone({ onFile }: UseMp3DropzoneParams) {
  const [isDragOver, setIsDragOver] = useState(false)
  const dragCounter = useRef(0)

  const acceptFile = useCallback(
    (file: File) => {
      if (!isMp3(file)) {
        toast.warning("Apenas arquivos MP3")
        return
      }
      onFile(file)
    },
    [onFile],
  )

  const onDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragOver(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragOver(false)
    }
  }, [])

  const onDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const onDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current = 0
      setIsDragOver(false)

      const file = e.dataTransfer.files?.[0]
      if (file) acceptFile(file)
    },
    [acceptFile],
  )

  return {
    isDragOver,
    acceptFile,
    bind: {
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
    },
  }
}
