import type { SVGProps } from 'react'

export function MoveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 9l-3 3 3 3" />
      <path d="M19 9l3 3-3 3" />
      <path d="M9 5l3-3 3 3" />
      <path d="M9 19l3 3 3-3" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
    </svg>
  )
}
