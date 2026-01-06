import { createFileRoute } from '@tanstack/react-router'

import MyTalkLayout from '@/modules/mytalk/layouts/MyTalk'
import { WhoAmIUserContextProvider } from '@/modules/mytalk/stores/who-am-i-user'

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
