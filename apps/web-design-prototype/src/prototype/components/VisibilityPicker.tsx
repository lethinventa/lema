import { mockGroups } from '../home/homeMockData'

export interface VisibilitySelection {
  context: 'personal' | 'group'
  groupId?: string
}

interface VisibilityPickerProps {
  value: VisibilitySelection
  onChange: (value: VisibilitySelection) => void
  hint?: string
}

// Pessoal + um botão por grupo do usuário (Fase 1 do plano multi-grupo) — não
// existe mais "o grupo", cada item precisa dizer qual dos grupos é o dono.
export function VisibilityPicker({ value, onChange, hint }: VisibilityPickerProps) {
  return (
    <div>
      <span className="mb-2 block text-[13px] font-medium text-ink-muted">Visibilidade</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange({ context: 'personal' })}
          className={`rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
            value.context === 'personal'
              ? 'border-accent bg-accent text-ink'
              : 'border-line bg-surface text-ink-muted'
          }`}
        >
          Pessoal
        </button>
        {mockGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => onChange({ context: 'group', groupId: group.id })}
            className={`rounded-sm border px-3 py-2.5 text-[13px] font-semibold transition active:scale-95 ${
              value.context === 'group' && value.groupId === group.id
                ? 'border-accent bg-accent text-ink'
                : 'border-line bg-surface text-ink-muted'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>
      {hint ? <p className="mt-2 text-[11px] leading-normal text-ink-faint">{hint}</p> : null}
    </div>
  )
}
