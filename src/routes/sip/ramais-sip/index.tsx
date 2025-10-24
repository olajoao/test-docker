import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sip/ramais-sip/')({
  component: RouteComponent,
  loader: () => ({
    crumb: ['SIP', 'Ramais SIP'],
  }),
})

function RouteComponent() {
  return <div className='text-3xl text-sky-500'>Hello "/ramais-sip/"!</div>
}
