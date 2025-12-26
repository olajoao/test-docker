import { useState, useRef, useCallback, useEffect } from "react"
import { format } from "date-fns"

interface UseSmoothTimerProps {
  maxDuration?: number
  onMaxDurationReached?: () => void
  updateInterval?: number
}

export function useSmoothTimer({
  maxDuration = 300,
  onMaxDurationReached,
  updateInterval = 100,
}: UseSmoothTimerProps = {}) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isRunningRef = useRef<boolean>(false)

  const start = useCallback(() => {
    if (isRunningRef.current) return

    startTimeRef.current = Date.now()
    isRunningRef.current = true
    setIsRunning(true)
    setTime(0)

    intervalRef.current = setInterval(() => {
      if (!isRunningRef.current) return

      const currentTime = Date.now()
      const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000)

      setTime(elapsedSeconds)

      if (elapsedSeconds >= maxDuration) {
        stop()
        onMaxDurationReached?.()
      }
    }, updateInterval)
  }, [maxDuration, onMaxDurationReached, updateInterval])

  const stop = useCallback(() => {
    isRunningRef.current = false
    setIsRunning(false)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setTime(0)
  }, [stop])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  const formatTime = useCallback((seconds: number) => {
    const date = new Date(0)
    date.setSeconds(seconds)
    return format(date, "mm:ss")
  }, [])

  return {
    time,
    isRunning,
    formattedTime: formatTime(time),
    start,
    stop,
    reset,
  }
}
