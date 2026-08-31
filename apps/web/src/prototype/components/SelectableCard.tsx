import type { ReactNode } from 'react'

interface SelectableCardProps {
  title: string
  description?: string
  icon?: ReactNode
  selected: boolean
  onSelect: () => void
}

export function SelectableCard({ title, description, icon, selected, onSelect }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-4 text-left transition active:scale-[0.99] ${
        selected ? 'border-ink bg-dark text-white' : 'border-line bg-surface text-ink'
      }`}
    >
      {icon ? (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-lg ${
            selected ? 'bg-white/15' : 'bg-surface-muted'
          }`}
        >
          {icon}
        </span>
      ) : null}
      <span className="flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        {description ? (
          <span className={`mt-0.5 block text-[13px] ${selected ? 'text-white/70' : 'text-ink-muted'}`}>
            {description}
          </span>
        ) : null}
      </span>
      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-white bg-white' : 'border-line'
        }`}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-dark" /> : null}
      </span>
    </button>
  )
}
