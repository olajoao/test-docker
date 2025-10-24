import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sip-trunks/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sip-trunks/"!</div>
}
