import { mockGroup } from '../home/homeMockData'

export type ContextFilterValue = 'all' | 'personal' | 'group' | 'shared'

const CHIPS: { value: ContextFilterValue; label: string }[] = [
  { value: 'all', label: 'Tudo' },
  { value: 'personal', label: 'Pessoal' },
  { value: 'group', label: mockGroup.name },
  { value: 'shared', label: 'Compartilhado' },
]

interface ContextFilterChipsProps {
  value: ContextFilterValue
  onChange: (value: ContextFilterValue) => void
}

export function ContextFilterChips({ value, onChange }: ContextFilterChipsProps) {
  return (
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
      {CHIPS.map((chip) => (
        <button
          key={chip.value}
          type="button"
          onClick={() => onChange(chip.value)}
          className={`shrink-0 rounded-sm border px-3.5 py-2 text-[13px] transition active:scale-95 ${
            value === chip.value
              ? 'border-accent bg-accent font-bold text-white'
              : 'border-line bg-surface font-medium text-ink-muted'
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
