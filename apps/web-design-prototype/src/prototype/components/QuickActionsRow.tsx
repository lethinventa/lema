import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export type QuickActionTone = 'mint' | 'sky' | 'peach' | 'goal'

const TONE_STYLES: Record<QuickActionTone, string> = {
  mint: 'bg-mint-bg text-mint-fg',
  sky: 'bg-sky-bg text-sky-fg',
  peach: 'bg-peach-bg text-peach-fg',
  goal: 'bg-goal-soft text-goal',
}

export interface QuickAction {
  label: string
  icon: LucideIcon
  tone: QuickActionTone
  to: string
}

// Fileira de atalhos em círculo (referência: tela inicial do Inter) — cada
// atalho já leva direto ao ponto de criação daquele domínio, não só à área.
// Único lugar do design system onde um controle usa --radius-pill fora de
// avatar/track (ver nota em index.css); decisão deliberada pra esse padrão.
export function QuickActionsRow({ actions }: { actions: QuickAction[] }) {
  const navigate = useNavigate()

  return (
    <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-1">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => navigate(action.to)}
            className="flex shrink-0 flex-col items-center gap-1.5 transition active:scale-95"
          >
            <span className={`flex h-14 w-14 items-center justify-center rounded-pill ${TONE_STYLES[action.tone]}`}>
              <Icon size={22} strokeWidth={2.2} />
            </span>
            <span className="max-w-[64px] text-center text-[11px] font-bold leading-tight text-ink">
              {action.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
