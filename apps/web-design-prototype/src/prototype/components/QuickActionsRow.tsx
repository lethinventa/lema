import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface QuickAction {
  label: string
  icon: LucideIcon
  to: string
}

// Grid de atalhos em tile quadrado (referência explícita da Lethicia: bloco
// Missões/Cashback na conta/Comprar pontos do Inter, não o círculo do
// Pix/Pagar/Cartões — testamos círculo antes e ela preferiu este). Cada
// atalho já leva direto ao ponto de criação daquele domínio, não só à área.
// Neutro de propósito, não um tom por domínio ("não quero mais esses
// coloridos").
export function QuickActionsRow({ actions }: { actions: QuickAction[] }) {
  const navigate = useNavigate()

  return (
    <div className="flex gap-2">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => navigate(action.to)}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl bg-surface-muted px-2 py-3 transition active:scale-95"
          >
            <Icon size={20} strokeWidth={2.2} className="text-ink" />
            <span className="w-full text-balance break-words text-center text-[11px] font-bold leading-tight text-ink">
              {action.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
