import type { ReactNode } from 'react'

export function SectionLabel({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-ink">
      <span className="text-ink-muted">{icon}</span>
      {children}
    </span>
  )
}
