import { Phone, PhoneOff, PhoneCall, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { RTCSession } from '../types/jssip'
import { createLogger } from '../lib/logger'
import { getDisplayName } from '../types/call'

const logger = createLogger('Incoming')

interface IncomingProps {
  session: RTCSession
  onAnswer: () => void
  onReject: () => void
}

export function Incoming({ session, onAnswer, onReject }: IncomingProps) {
  const [isAnswering, setIsAnswering] = useState(false)
  
  // Extract display name from session
  const displayName = getDisplayName(session.remote_identity)

  // Get last segment if underscore-separated
  const getLastSegment = (input?: string) => {
    if (!input) return 'Desconhecido'
    const parts = input.split('_')
    return parts[parts.length - 1]
  }

  const name = getLastSegment(displayName)
  
  // Monitor session status changes
  useEffect(() => {
    const handleAccepted = () => {
      logger.debug('Session accepted, updating UI')
      setIsAnswering(false)
    }

    const handleFailed = () => {
      logger.debug('Session failed, resetting UI')
      setIsAnswering(false)
    }

    session.on('accepted', handleAccepted)
    session.on('failed', handleFailed)

    return () => {
      session.off('accepted', handleAccepted)
      session.off('failed', handleFailed)
    }
  }, [session])

  const handleAnswer = () => {
    logger.debug('Answer button clicked')
    setIsAnswering(true)
    onAnswer()
  }

  const handleReject = () => {
    logger.debug('Reject button clicked')
    onReject()
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full bg-linear-to-b from-primary/5 to-background p-8">
      {/* Animated Rings */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-primary/20 animate-ping" />
        </div>
        <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center">
          <PhoneCall className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      {/* Caller Info */}
      <div className="text-center mb-12 space-y-2">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-muted-foreground">Chamada recebida...</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-8">
        {/* Reject Button */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="destructive"
            size="icon"
            onClick={handleReject}
            disabled={isAnswering}
            className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
          <span className="text-sm text-muted-foreground">Rejeitar</span>
        </div>

        {/* Answer Button */}
        <div className="flex flex-col items-center gap-2">
          {isAnswering ? (
            <>
              <Button
                variant="default"
                size="icon"
                disabled
                className="h-16 w-16 rounded-full bg-green-600 shadow-lg cursor-not-allowed"
              >
                <Loader2 className="h-7 w-7 animate-spin" />
              </Button>
              <span className="text-sm text-muted-foreground">Atendendo...</span>
            </>
          ) : (
            <>
              <Button
                variant="default"
                size="icon"
                onClick={handleAnswer}
                className="h-16 w-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
              >
                <Phone className="h-7 w-7" />
              </Button>
              <span className="text-sm text-muted-foreground">Atender</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
