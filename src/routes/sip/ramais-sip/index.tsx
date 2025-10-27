import RamaisSip from '@/pages/sip/ramais-sip/ramais-sip'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sip/ramais-sip/')({
  component: RouteComponent,
  loader: () => ({
    crumb: ['SIP', 'Ramais SIP'],
  }),
})

function RouteComponent() {
  return <RamaisSip />
}
