import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_layout/sip/trunks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/sip/trunks"!</div>
}
