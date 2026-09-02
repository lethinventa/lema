import { CalendarDays, CheckSquare2, Home, Target, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/home', label: 'Home', icon: Home, end: true },
  { to: '/home/tarefas', label: 'Tarefas', icon: CheckSquare2, end: false },
  { to: '/home/calendario', label: 'Calendário', icon: CalendarDays, end: false },
  { to: '/home/objetivos', label: 'Objetivos', icon: Target, end: false },
  { to: '/home/financas', label: 'Finanças', icon: Wallet, end: false },
] as const

export function BottomNav() {
  return (
    <nav className="absolute inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] flex items-center gap-1 rounded-pill border border-line bg-surface px-2 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.1)]">
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
