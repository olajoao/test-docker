import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sip/trunks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/sip/trunks"!</div>
}
