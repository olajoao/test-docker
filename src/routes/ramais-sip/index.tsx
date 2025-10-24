import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ramais-sip/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ramais-sip/"!</div>
}
