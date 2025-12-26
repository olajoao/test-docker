import { createFileRoute } from '@tanstack/react-router'

import { MessageView } from '@/modules/mytalk/channels/messages/[channel_id]'

export const Route = createFileRoute('/mytalk/$channelId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { channelId } = Route.useParams()
  return <MessageView channelId={channelId} />
}
