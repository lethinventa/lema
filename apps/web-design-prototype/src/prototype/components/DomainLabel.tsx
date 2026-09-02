import type { ReactNode } from 'react'

export type BadgeTone = 'mint' | 'sky' | 'peach' | 'lavender' | 'sun' | 'lilac' | 'goal'

const BADGE_STYLES: Record<BadgeTone, string> = {
  mint: 'bg-mint-bg text-mint-fg',
  sky: 'bg-sky-bg text-sky-fg',
  peach: 'bg-peach-bg text-peach-fg',
  // Kept for compatibility, but avoid for new call sites — lavender is the
  // same hex as --color-accent, reserved for CTAs/primary actions, not
  // decorative section icons. Use 'goal' (Objetivos) or 'lilac' (generic).
  lavender: 'bg-lavender-bg text-lavender-fg',
  sun: 'bg-sun-bg text-sun-fg',
  lilac: 'bg-cat-lilac-bg text-cat-lilac-fg',
  // Objetivos' own domain color — deliberately not accent (Finanças' money
  // color) and not the shared category palette, since a goal's identity
  // shouldn't be confused with either.
  goal: 'bg-goal-soft text-goal',
}

interface DomainLabelProps {
  icon: ReactNode
  tone: BadgeTone
  size?: 'lg' | 'sm'
  children: ReactNode
}

export function DomainLabel({ icon, tone, size = 'lg', children }: DomainLabelProps) {
  const badgeSize = size === 'lg' ? 'h-7 w-7' : 'h-6 w-6'
  const textSize = size === 'lg' ? 'text-[15px] font-bold' : 'text-[13px] font-bold'
  return (
    <span className="mb-3 flex items-center gap-2">
      <span className={`flex ${badgeSize} shrink-0 items-center justify-center rounded-sm ${BADGE_STYLES[tone]}`}>
        {icon}
      </span>
      <span className={`${textSize} text-ink`}>{children}</span>
    </span>
  )
}
