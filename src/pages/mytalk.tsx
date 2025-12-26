import { createFileRoute } from '@tanstack/react-router'

import { WhoAmIUserContextProvider } from '@/context/who-am-i-user'
import MyTalkLayout from '@/modules/mytalk/layouts/MyTalk'

export const Route = createFileRoute('/mytalk')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <WhoAmIUserContextProvider>
      <MyTalkLayout />
    </WhoAmIUserContextProvider>
  )
}
