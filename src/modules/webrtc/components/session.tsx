import { PhoneOff, Pause, Play, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { RTCSession } from '../types/jssip'
import { createLogger } from '../lib/logger'
import { useCallTimer } from '../hooks/use-call-timer'
import { formatDuration } from '../types/call'
import { useAudioPlayer } from '../hooks/use-audio-player'

const logger = createLogger('Session')

interface SessionProps {
  session: RTCSession
  remoteDisplayName?: string
  onNotify?: (notification: { level: 'success' | 'error' | 'info'; title: string; message?: string }) => void
}

export function Session({ session, remoteDisplayName, onNotify }: SessionProps) {
  const audioPlayer = useAudioPlayer()
  const [localHold, setLocalHold] = useState(false)
  const [remoteHold, setRemoteHold] = useState(false)
  const [canHold, setCanHold] = useState(false)
  const [ringing, setRinging] = useState(false)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localClonedStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)

  // Use the call timer hook
  const duration = useCallTimer()

  // Log props for debugging
  logger.debug('Session props:', { 
    remoteDisplayName, 
    hasSession: !!session,
    sessionDirection: session?.direction 
  })

  // Determine status text - simplificado baseado no código legado
  const getStatusText = () => {
    // Ordem de prioridade dos estados
    if (ringing) return 'Chamando...'
    if (localHold && remoteHold) return 'Ambos em espera'
    if (localHold) return 'Em espera'
    if (remoteHold) return 'Contato em espera'
    if (duration > 0) return 'Chamada em andamento'
    return 'Conectando...'
  }

  const statusText = getStatusText()

  // Handle hang up
  const handleHangUp = () => {
    logger.debug('handleHangUp()')
    if (!session) {
      logger.warn('No session to hang up')
      return
    }
    
    try {
      // Verificar se a session já terminou (JsSIP: STATUS_CONFIRMED=9, STATUS_TERMINATED=8)
      const status = (session as any).status ?? (session as any)._status
      logger.debug('Session state before terminate:', status)

      const isEnded = typeof (session as any).isEnded === 'function' ? (session as any).isEnded() : false
      const C = (session as any).C
      const isTerminatedByStatus =
        C && (status === C.STATUS_TERMINATED || status === C.STATUS_CANCELED)

      if (isEnded || isTerminatedByStatus) {
        logger.warn('Session already ended')
        return
      }

      logger.info('Terminating call')
      ;(session as any).terminate()
    } catch (error) {
      logger.error('Error terminating call:', error)
      onNotify?.({
        level: 'error',
        title: 'Erro ao encerrar chamada',
        message: String(error),
      })
    }
  }

  // Handle hold
  const handleHold = () => {
    logger.info('handleHold() - Placing call on hold')
    if (session) {
      try {
        session.hold({ useUpdate: true })
        logger.debug('Hold command sent successfully')
        
        // Tocar música de espera
        audioPlayer.play('moh')
      } catch (error) {
        logger.error('Failed to hold call:', error)
        onNotify?.({
          level: 'error',
          title: 'Erro ao colocar em espera',
          message: String(error),
        })
      }
    } else {
      logger.warn('Cannot hold - no active session')
    }
  }

  // Handle resume
  const handleResume = () => {
    logger.info('handleResume() - Resuming call from hold')
    if (session) {
      try {
        session.unhold({ useUpdate: true })
        logger.debug('Unhold command sent successfully')
        
        // Parar música de espera
        audioPlayer.stop('moh')
      } catch (error) {
        logger.error('Failed to resume call:', error)
        onNotify?.({
          level: 'error',
          title: 'Erro ao retomar chamada',
          message: String(error),
        })
      }
    } else {
      logger.warn('Cannot resume - no active session')
    }
  }

  useEffect(() => {
    mountedRef.current = true
    logger.debug('Session component mounted')

    const localVideo = localVideoRef.current
    const remoteVideo = remoteVideoRef.current
    if (!localVideo || !remoteVideo || !session) return

    const peerconnection = session.connection
    if (!peerconnection) {
      logger.error('No peer connection available')
      return
    }
    
    // Get local stream from sender tracks
    const senders = peerconnection.getSenders()
    if (senders && senders.length > 0) {
      const localTracks = senders.map(sender => sender.track).filter((t): t is MediaStreamTrack => t !== null)
      if (localTracks.length > 0) {
        const localStream = new MediaStream(localTracks)
        localClonedStreamRef.current = localStream.clone()
        localVideo.srcObject = localClonedStreamRef.current
      }
    }

    // Get remote stream from receiver tracks
    const receivers = peerconnection.getReceivers()
    if (receivers && receivers.length > 0) {
      const remoteTracks = receivers.map(receiver => receiver.track).filter((t): t is MediaStreamTrack => t !== null)
      if (remoteTracks.length > 0) {
        const remoteStream = new MediaStream(remoteTracks)
        handleRemoteStream(remoteStream)
      }
    }

    // Initialize empty remote stream if no tracks yet
    if (!remoteStreamRef.current) {
      remoteStreamRef.current = new MediaStream()
      remoteVideo.srcObject = remoteStreamRef.current
    }

    // Set canHold if session already established
    if (session && session.isEstablished && session.isEstablished()) {
      setTimeout(() => {
        if (!mountedRef.current) return
        setCanHold(true)
      })
    }

    // Session event listeners
    const handleProgress = (data: any) => {
      if (!mountedRef.current) return
      logger.debug('Session "progress" event', data)
      if (session.direction === 'outgoing') {
        logger.debug('Setting ringing to true for outgoing call')
        setRinging(true)
      }
    }

    const handleAccepted = (data: any) => {
      if (!mountedRef.current) return
      logger.debug('Session "accepted" event', data)
      logger.debug('Call accepted - setting ringing to false and canHold to true')
      
      if (session.direction === 'outgoing') {
        onNotify?.({
          level: 'success',
          title: 'Chamada atendida',
        })
      }
      
      setCanHold(true)
      setRinging(false)
    }

    const handleConfirmed = (data: any) => {
      if (!mountedRef.current) return
      logger.debug('Session "confirmed" event', data)
      logger.debug('Call confirmed - ensuring ringing is false')
      
      setCanHold(true)
      setRinging(false)
    }

    const handleFailed = (data: any) => {
      if (!mountedRef.current) return
      logger.debug('Session "failed" event', data)
      
      onNotify?.({
        level: 'error',
        title: 'Falha na chamada',
        message: `Motivo: ${data.cause}`,
      })
      
      if (session.direction === 'outgoing') {
        setRinging(false)
      }
    }

    const handleEnded = (data: any) => {
      if (!mountedRef.current) return
      logger.debug('Session "ended" event', data)
      
      onNotify?.({
        level: 'info',
        title: 'Chamada encerrada',
        message: `Motivo: ${data.cause}`,
      })
      
      if (session.direction === 'outgoing') {
        setRinging(false)
      }
    }

    const handleHold = (data: any) => {
      if (!mountedRef.current) return
      logger.info('Session "hold" event received', {
        originator: data.originator,
        localHold,
        remoteHold
      })
      
      if (data.originator === 'local') {
        logger.debug('Local hold activated')
        setLocalHold(true)
        onNotify?.({
          level: 'info',
          title: 'Chamada em espera',
          message: 'Você colocou a chamada em espera',
        })
      } else if (data.originator === 'remote') {
        logger.debug('Remote hold activated')
        setRemoteHold(true)
        onNotify?.({
          level: 'info',
          title: 'Contato em espera',
          message: 'O contato colocou você em espera',
        })
      }
    }

    const handleUnhold = (data: any) => {
      if (!mountedRef.current) return
      logger.info('Session "unhold" event received', {
        originator: data.originator,
        localHold,
        remoteHold
      })
      
      if (data.originator === 'local') {
        logger.debug('Local hold deactivated')
        setLocalHold(false)
        onNotify?.({
          level: 'success',
          title: 'Chamada retomada',
          message: 'Você retomou a chamada',
        })
      } else if (data.originator === 'remote') {
        logger.debug('Remote hold deactivated')
        setRemoteHold(false)
        onNotify?.({
          level: 'success',
          title: 'Contato retomou',
          message: 'O contato retomou a chamada',
        })
      }
    }

    // Attach event listeners
    session.on('progress', handleProgress)
    session.on('accepted', handleAccepted)
    session.on('confirmed', handleConfirmed)
    session.on('failed', handleFailed)
    session.on('ended', handleEnded)
    session.on('hold', handleHold)
    session.on('unhold', handleUnhold)

    // Handle incoming tracks (modern API)
    const handleTrack = (event: RTCTrackEvent) => {
      if (!mountedRef.current) return
      
      const remoteVideo = remoteVideoRef.current
      if (!remoteVideo) return

      // Skip if already has tracks
      if (remoteVideo.srcObject && (remoteVideo.srcObject as MediaStream).getTracks().length > 0) {
        return
      }

      // Initialize remote stream if needed
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream()
        remoteVideo.srcObject = remoteStreamRef.current
      }

      // Add track if not already present
      const existingTrack = remoteStreamRef.current.getTracks().find(t => t.id === event.track.id)
      if (!existingTrack) {
        remoteStreamRef.current.addTrack(event.track)
      }
    }

    peerconnection.addEventListener('track', handleTrack)

    // Cleanup
    return () => {
      mountedRef.current = false
      logger.debug('Session component unmounting')

      // Remove event listeners
      session.off('progress', handleProgress)
      session.off('accepted', handleAccepted)
      session.off('failed', handleFailed)
      session.off('ended', handleEnded)
      session.off('hold', handleHold)
      session.off('unhold', handleUnhold)
      peerconnection.removeEventListener('track', handleTrack)

      // Close local stream
      if (localClonedStreamRef.current) {
        localClonedStreamRef.current.getTracks().forEach(track => track.stop())
        localClonedStreamRef.current = null
      }

      // Stop remote tracks
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach(track => track.stop())
        remoteStreamRef.current = null
      }
    }
  }, [session])

  const handleRemoteStream = (stream: MediaStream) => {
    logger.debug('Handling remote stream', stream)
    
    const remoteVideo = remoteVideoRef.current
    if (!remoteVideo) return

    // Initialize remote stream if needed
    if (!remoteStreamRef.current) {
      remoteStreamRef.current = new MediaStream()
      remoteVideo.srcObject = remoteStreamRef.current
    }

    // Add all tracks from stream
    stream.getTracks().forEach(track => {
      const existingTrack = remoteStreamRef.current?.getTracks().find(t => t.id === track.id)
      if (!existingTrack && remoteStreamRef.current) {
        remoteStreamRef.current.addTrack(track)
      }
    })

    // Listen for track changes
    stream.addEventListener('addtrack', (event) => {
      if (remoteVideo.srcObject !== stream) return
      logger.debug('Remote stream "addtrack" event', event.track)
      remoteVideo.srcObject = stream
    })

    stream.addEventListener('removetrack', () => {
      if (remoteVideo.srcObject !== stream) return
      logger.debug('Remote stream "removetrack" event')
      remoteVideo.srcObject = stream
    })
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full bg-linear-to-br from-background via-background to-primary/5">
      {/* Hidden video elements for audio streams */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        className="hidden"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="hidden"
      />

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-center gap-6 max-w-md w-full px-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 flex items-center justify-center">
            <User className="w-16 h-16 text-primary" />
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
          </div>
          {/* Pulse animation for active call */}
          {!ringing && duration > 0 && (
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          )}
        </div>

        {/* Contact Info */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            {remoteDisplayName || 'Desconhecido'}
          </h2>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-muted-foreground">{statusText}</p>
            {duration > 0 && (
              <p className="text-lg font-mono text-primary font-medium">
                {formatDuration(duration)}
              </p>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {/* Hold/Resume Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={localHold ? handleResume : handleHold}
            disabled={!canHold}
            className="h-16 w-16 rounded-full bg-black/50 hover:scale-105 transition-transform cursor-pointer"
            title={localHold ? 'Retomar' : 'Pausar'}
          >
            {localHold ? (
              <Play className="h-6 w-6" />
            ) : (
              <Pause className="h-6 w-6" />
            )}
          </Button>

          {/* Hang Up Button */}
          <Button
            variant="destructive"
            size="icon"
            onClick={handleHangUp}
            className="h-16 w-16 rounded-full cursor-pointer bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform shadow-lg"
            title="Desligar"
          >
            <PhoneOff className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  )
}
