import { useState, type FormEvent } from 'react'
import { useWebRTCStore } from '../stores/webrtc-store'
import { Dialpad } from './dialpad'
import { createLogger } from '../lib/logger'

const logger = createLogger('Dialer')

interface DialerProps {
  onCall: (uri: string) => void
  showDialpad?: boolean
}

export function Dialer({ onCall, showDialpad = false }: DialerProps) {
  const { settings, connectionStatus, activeCall } = useWebRTCStore()
  const [uri, setUri] = useState('')

  const hasActiveCall = !!activeCall
  const canCall = !hasActiveCall && (connectionStatus === 'connected' || connectionStatus === 'registered')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!canCall || !uri.trim()) {
      logger.debug('Cannot make call', { canCall, uri })
      return
    }

    logger.debug(`Initiating call to: ${uri}`)
    onCall(uri)
    setUri('')
  }

  const handleCall = () => {
    if (!canCall || !uri.trim()) return
    
    logger.debug(`Call button clicked for: ${uri}`)
    onCall(uri)
    setUri('')
  }

  // Status badge configuration
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'registered':
        return { label: 'Registrado', color: 'bg-green-500' }
      case 'connected':
        return { label: 'Conectado', color: 'bg-blue-500' }
      case 'connecting':
        return { label: 'Conectando', color: 'bg-yellow-500' }
      default:
        return { label: 'Desconectado', color: 'bg-gray-500' }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div className="flex flex-col gap-3 h-full w-full max-w-md p-3 mx-auto lg:mx-0">
      {/* Status and Extension Display */}
      <div className="flex sm:flex-col gap-2">
        {/* Connection Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-opacity-10 ${statusConfig.color.replace('bg-', 'bg-opacity-10 border border-')}`}>
          <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
          <span className="text-xs font-medium">{statusConfig.label}</span>
        </div>

        {/* Extension Display */}
        <div className="flex w-full flex-col gap-0.5 px-3 py-2 bg-secondary/50 rounded-lg">
          <span className="text-xs text-muted-foreground">Ramal</span>
          <span className="text-base font-semibold">{settings.display_name || 'N/A'}</span>
        </div>
      </div>

      {/* Dialpad Component */}
      <Dialpad
        uri={uri}
        onUriChange={setUri}
        onCall={handleCall}
        onSubmit={handleSubmit}
        canCall={canCall}
        busy={hasActiveCall}
        showDialpad={showDialpad}
      />
    </div>
  )
}
