import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

export function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto pb-28">{children}</div>
      <BottomNav />
    </div>
  )
}
