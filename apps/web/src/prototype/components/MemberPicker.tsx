import { Check } from 'lucide-react'
import { initialMembersByGroup } from '../groups/groupsMockData'
import { getInitials, getPersonColor } from './palette'

interface MemberPickerProps {
  groupId: string
  label: string
  selectedIds: string[]
  onChange: (ids: string[]) => void
  hint?: string
}

// Responsável (UC-TASK-005) e participante de grupo (UC-CAL-004) só podem
// ser quem já tem acesso — pra um item GROUP, isso é sempre um membro do
// grupo, nunca um nome digitado à mão.
export function MemberPicker({ groupId, label, selectedIds, onChange, hint }: MemberPickerProps) {
  const members = initialMembersByGroup[groupId] ?? []

  function toggle(memberId: string) {
    onChange(selectedIds.includes(memberId) ? selectedIds.filter((id) => id !== memberId) : [...selectedIds, memberId])
  }

  return (
    <div>
      <span className="mb-2 block text-[13px] font-medium text-ink-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => {
          const selected = selectedIds.includes(member.id)
          return (
            <button
              key={member.id}
              type="button"
              onClick={() => toggle(member.id)}
              className={`flex items-center gap-1.5 rounded-pill border py-1 pl-1 pr-2.5 text-[12.5px] font-semibold transition active:scale-95 ${
                selected ? 'border-accent bg-accent-soft text-accent' : 'border-line bg-surface text-ink-muted'
              }`}
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill text-[10px] font-extrabold text-white"
                style={{ backgroundColor: getPersonColor(member.name) }}
              >
                {getInitials(member.name)}
              </span>
              {member.name}
              {selected ? <Check size={13} strokeWidth={3} /> : null}
            </button>
          )
        })}
      </div>
      {hint ? <p className="mt-2 text-[11px] leading-normal text-ink-faint">{hint}</p> : null}
    </div>
  )
}
