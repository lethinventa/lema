import type { ReactNode } from 'react'

export function Tile({ span = 1, className = '', children }: { span?: 1 | 2; className?: string; children: ReactNode }) {
  return (
    <div
      className={`${span === 2 ? 'col-span-2' : 'col-span-1'} shadow-card rounded-[var(--radius-card)] bg-surface p-5 ${className}`}
    >
      {children}
    </div>
  )
}
