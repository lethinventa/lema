import { mockGroups } from '../home/homeMockData'

const GROUP_PREFIX = 'group:'

// 'all' | 'personal' | 'shared' | 'group:<groupId>' — um chip por grupo do
// usuário, não um valor fixo (ver Fase 1 do plano multi-grupo).
export type ContextFilterValue = 'all' | 'personal' | 'shared' | `${typeof GROUP_PREFIX}${string}`

export function groupFilterValue(groupId: string): ContextFilterValue {
  return `${GROUP_PREFIX}${groupId}`
}

export function groupIdFromFilter(filter: ContextFilterValue): string | null {
  return filter.startsWith(GROUP_PREFIX) ? filter.slice(GROUP_PREFIX.length) : null
}

export function matchesContext(
  filter: ContextFilterValue,
  item: { context: 'personal' | 'group' | 'shared'; groupId?: string },
) {
  if (filter === 'all') return true
  const filterGroupId = groupIdFromFilter(filter)
  if (filterGroupId) return item.context === 'group' && item.groupId === filterGroupId
  return filter === item.context
}

interface ContextFilterChipsProps {
  value: ContextFilterValue
  onChange: (value: ContextFilterValue) => void
}

export function ContextFilterChips({ value, onChange }: ContextFilterChipsProps) {
  const chips: { value: ContextFilterValue; label: string }[] = [
    { value: 'all', label: 'Tudo' },
    { value: 'personal', label: 'Pessoal' },
    ...mockGroups.map((g) => ({ value: groupFilterValue(g.id), label: g.name })),
    { value: 'shared', label: 'Compartilhado' },
  ]

  return (
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          onClick={() => onChange(chip.value)}
          className={`shrink-0 rounded-pill px-4 py-2 text-[13px] transition active:scale-95 ${
            value === chip.value ? 'bg-accent font-bold text-ink' : 'bg-surface-muted font-medium text-ink-muted'
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
