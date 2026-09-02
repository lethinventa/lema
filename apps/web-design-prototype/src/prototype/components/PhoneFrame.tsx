import type { ReactNode } from 'react'

/**
 * On wide viewports (desktop preview) this centers the app inside a phone-shaped
 * frame so it can be reviewed like a mobile screen. On real mobile viewports the
 * frame disappears and the app fills the screen edge to edge.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-bg md:flex md:items-center md:justify-center md:bg-surface-muted md:py-10">
      <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-bg md:h-[860px] md:w-[400px] md:rounded-[48px] md:border md:border-line md:shadow-[0_30px_80px_rgba(17,17,17,0.18)]">
        {children}
      </div>
    </div>
  )
}
