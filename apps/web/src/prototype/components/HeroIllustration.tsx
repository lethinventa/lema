import { Calendar, CheckSquare, Users, Wallet } from 'lucide-react'

/**
 * Flat "life organized" summary card for the entry screen: a single card listing the
 * product's domains — stands in for real photography/illustration, which the prototype
 * doesn't have. Deliberately flat (no rotation/overlap/heavy shadow) to stay calm.
 */
export function HeroIllustration() {
  return (
    <div className="flex h-48 flex-col justify-between rounded-md bg-dark p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white">
          <CheckSquare size={16} strokeWidth={2.2} />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white">
          <Calendar size={16} strokeWidth={2.2} />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white">
          <Wallet size={16} strokeWidth={2.2} />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-white">
          <Users size={16} strokeWidth={2.2} />
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="h-2 w-3/4 rounded-sm bg-white/15" />
        <span className="h-2 w-1/2 rounded-sm bg-white/15" />
      </div>
    </div>
  )
}
