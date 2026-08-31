import { CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'

export type IconTone = 'mint' | 'peach' | 'lavender' | 'sky'

const TONE_STYLES: Record<IconTone, string> = {
  mint: 'bg-mint-bg text-mint-fg',
  peach: 'bg-peach-bg text-peach-fg',
  lavender: 'bg-lavender-bg text-lavender-fg',
  sky: 'bg-sky-bg text-sky-fg',
}

interface SelectableCardProps {
  title: string
  description?: string
  icon?: ReactNode
  tone?: IconTone
  selected: boolean
  onSelect: () => void
}

export function SelectableCard({ title, description, icon, tone = 'mint', selected, onSelect }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-lg border bg-surface px-4 py-3.5 text-left transition active:scale-[0.99] ${
        selected ? 'border-accent bg-accent-soft/60' : 'border-line'
      }`}
    >
      {icon ? (
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${TONE_STYLES[tone]}`}>
          {icon}
        </span>
      ) : null}
      <span className="flex-1">
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        {description ? <span className="mt-0.5 block text-[13px] text-ink-muted">{description}</span> : null}
      </span>
      {selected ? (
        <CheckCircle2 size={20} strokeWidth={2.2} className="shrink-0 text-accent" />
      ) : (
        <span className="h-5 w-5 shrink-0 rounded-full border-2 border-line" />
      )}
    </button>
  )
}
