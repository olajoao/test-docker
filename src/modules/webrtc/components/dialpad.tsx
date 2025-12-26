import { Delete, Phone } from 'lucide-react'
import { useEffect, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWebRTCStore } from '../stores/webrtc-store'
import { createLogger } from '../lib/logger'
import { isMobile } from '../lib/utils'

const logger = createLogger('Dialpad')

interface DialpadProps {
  uri: string
  onUriChange: (value: string) => void
  onCall: () => void
  onSubmit: (e: FormEvent) => void
  canCall: boolean
  busy: boolean
  showDialpad?: boolean
}

const DIALPAD_BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'] as const

export function Dialpad({ 
  uri, 
  onUriChange, 
  onCall, 
  onSubmit, 
  canCall, 
  busy,
  showDialpad = false 
}: DialpadProps) {
  const { activeCall } = useWebRTCStore()

  // Clear URI when call ends
  useEffect(() => {
    if (!busy && uri) {
      logger.debug('Call ended, clearing URI')
      onUriChange('')
    }
  }, [busy])

  const handleBackspace = () => {
    if (!uri || uri.length === 0) return
    onUriChange(uri.slice(0, -1))
  }

  const handleDigitClick = (digit: string) => {
    logger.debug(`Digit clicked: ${digit}`)
    
    // Add digit to URI
    const newUri = uri + digit
    onUriChange(newUri)

    // If in active call, send DTMF
    if (busy && activeCall?.session) {
      logger.info(`Sending DTMF tone: ${digit}`)
      try {
        activeCall.session.sendDTMF(digit, {
          duration: 160,
        })
        logger.debug(`DTMF tone ${digit} sent successfully`)
      } catch (error) {
        logger.error('Error sending DTMF:', error)
      }
    }
  }

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (busy) {
      // If busy, just clear the URI
      onUriChange('')
    } else {
      // Otherwise, attempt to call
      onSubmit(e)
    }
  }

  // Hide dialpad on mobile when busy (unless forced to show)
  const shouldHide = busy && isMobile() && !showDialpad

  return (
    <section>
      <form
        onSubmit={handleFormSubmit}
        className={cn(
          'flex flex-col gap-3 py-3 transition-all duration-200',
          shouldHide && 'hidden'
        )}
      >
        {/* Number Input Area */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Número"
              value={uri}
              onChange={(e) => onUriChange(e.target.value)}
              className="text-base h-10 bg-background border-input"
              autoComplete="off"
            />
          </div>
          
          {/* Backspace Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleBackspace}
            disabled={!uri || uri.length === 0}
            className="h-10 w-10"
            aria-label="Apagar"
          >
            <Delete className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Dialpad Grid */}
        <div className="grid grid-cols-3 gap-2 justify-items-center">
          {DIALPAD_BUTTONS.map((digit) => (
            <Button
              key={digit}
              type="button"
              variant="outline"
              onClick={() => handleDigitClick(digit)}
              className={cn(
                'h-10 w-[60px] sm:h-[60px] text-xl font-semibold',
                'hover:bg-accent hover:scale-105 transition-transform',
                'active:scale-95'
              )}
              aria-label={`Dígito ${digit}`}
            >
              {digit}
            </Button>
          ))}
        </div>

        {/* Call Button */}
        <Button
          type="submit"
          onClick={onCall}
          disabled={!canCall || !uri.trim()}
          className={cn(
            'w-full h-11 text-base font-medium gap-2',
            'bg-green-600 hover:bg-green-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          <Phone className="h-5 w-5" />
          Ligar
        </Button>
      </form>
    </section>
  )
}
