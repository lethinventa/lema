import { CalendarDays, CheckSquare2, Home, Target, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/home', label: 'Home', icon: Home, end: true },
  { to: '/home/tarefas', label: 'Tarefas', icon: CheckSquare2, end: false },
  { to: '/home/calendario', label: 'Calendário', icon: CalendarDays, end: false },
  { to: '/home/objetivos', label: 'Objetivos', icon: Target, end: false },
  { to: '/home/financas', label: 'Finanças', icon: Wallet, end: false },
] as const

// 2026-09-03: nav bar deixa de ser um pill branco flutuando sobre a página
// (bg-surface + shadow) e passa a se fundir com o --color-bg — referência
// mostra a barra sem contorno próprio, só o item ativo com destaque.
export function BottomNav() {
  return (
    <nav className="absolute inset-x-0 bottom-0 flex items-center gap-1 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2">
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 rounded-pill py-2 text-[10px] font-medium transition active:scale-95 ${
              isActive ? 'bg-accent-soft text-accent' : 'text-ink-faint'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
