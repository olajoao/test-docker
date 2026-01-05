import { useState, useRef, useCallback, useEffect } from "react"
import { useSmoothTimer } from "./smooth-timer-hook"
import { useAudioStore } from "../../stores/audio-store"

interface UseAudioRecorderProps {
  maxDuration?: number
  onSendAudio?: () => void
  onCancel?: () => void
}

export function useAudioRecorderModel({ maxDuration = 300, onSendAudio, onCancel }: UseAudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordedDuration, setRecordedDuration] = useState(0)

  const { setAudio } = useAudioStore()

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recordingStartTimeRef = useRef<number>(0)

  const {
    time,
    formattedTime,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useSmoothTimer({
    maxDuration,
    onMaxDurationReached: () => {
      stopRecording()
    },
    updateInterval: 50,
  })

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setRecordedBlob(null)
      setRecordedDuration(0)
      resetTimer()

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream

      let mimeType = "audio/webm;codecs=opus"
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm"
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/mp4"
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = ""
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      })

      const chunks: Blob[] = []
      recordingStartTimeRef.current = Date.now()

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const recordingEndTime = Date.now()
        const actualDuration = (recordingEndTime - recordingStartTimeRef.current) / 1000

        const blob = new Blob(chunks, { type: mimeType || "audio/webm" })

        setRecordedBlob(blob)
        setRecordedDuration(actualDuration)

        const audioData = {
          blob,
          startTime: recordingStartTimeRef.current,
          stopTime: recordingEndTime,
          duration: actualDuration,
          options: {
            audioBitsPerSecond: 128000,
            mimeType: mimeType || "audio/webm",
          },
          blobURL: URL.createObjectURL(blob),
        }

        setAudio(audioData as any)
        stopTimer()
      }

      mediaRecorder.onerror = (event) => {
        console.error("Erro no MediaRecorder:", event)
        setError("Erro durante a gravação")
        stopTimer()
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100)

      setIsRecording(true)
      startTimer()
    } catch (error) {
      console.error("Erro ao iniciar gravação:", error)
      setError("Erro ao acessar o microfone. Verifique as permissões.")
      onCancel?.()
    }
  }, [onCancel, startTimer, stopTimer, resetTimer, setAudio])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [isRecording])

  const handleSendAudio = useCallback(() => {
    if (recordedBlob && onSendAudio) {
      onSendAudio()
    }
  }, [recordedBlob, onSendAudio])

  const handleDiscard = useCallback(() => {
    setRecordedBlob(null)
    setAudio(null)
    stopTimer()
    resetTimer()
    onCancel?.()
  }, [onCancel, stopTimer, resetTimer, setAudio])

  // Send audio after stopRecording is completed 
  useEffect(() => {
    if (recordedBlob && onSendAudio) {
      onSendAudio()
    }
  }, [recordedBlob, onSendAudio])

  // Auto-start recording on mount
  useEffect(() => {
    startRecording()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  return {
    // State
    isRecording,
    recordedBlob,
    error,
    recordedDuration,
    time,
    formattedTime,
    maxDuration,

    // Actions
    startRecording,
    stopRecording,
    handleSendAudio,
    handleDiscard,
  }
}
