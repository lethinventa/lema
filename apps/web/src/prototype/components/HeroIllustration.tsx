import { Calendar, CheckSquare, Users, Wallet } from 'lucide-react'

/**
 * Abstract "life organized" composition for the entry screen: a stack of soft cards
 * representing the product's domains, layered with intentional depth and offset —
 * standing in for real photography/illustration, which the prototype doesn't have.
 */
export function HeroIllustration() {
  return (
    <div className="relative flex h-56 items-center justify-center rounded-xl bg-dark">
      <div className="absolute h-24 w-24 -translate-x-16 -translate-y-8 rotate-[-8deg] rounded-lg bg-white/10" />
      <div className="absolute h-24 w-24 translate-x-16 translate-y-10 rotate-[10deg] rounded-lg bg-accent/25" />

      <div className="relative flex h-32 w-44 -rotate-3 flex-col justify-between rounded-lg bg-surface p-3 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent">
            <CheckSquare size={15} strokeWidth={2.2} />
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-muted">
            <Calendar size={15} strokeWidth={2.2} />
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="h-2 w-full rounded-pill bg-surface-muted" />
          <span className="h-2 w-3/5 rounded-pill bg-surface-muted" />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-muted">
            <Wallet size={15} strokeWidth={2.2} />
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-muted">
            <Users size={15} strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </div>
  )
}
