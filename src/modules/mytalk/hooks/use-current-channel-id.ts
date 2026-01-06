import { useRouterState } from '@tanstack/react-router'

export function useMyTalkChannelId(): string | undefined {
  return useRouterState({
    select: (state) => {
      const lastMatch = state.matches[state.matches.length - 1]
      const value = (lastMatch?.params as Record<string, unknown> | undefined)?.channelId
      return typeof value === 'string' && value.length ? value : undefined
    },
  })
}
