import { CalendarDays, CheckSquare2, Target, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { DomainLabel } from '../components/DomainLabel'
import { HomeLayout } from '../components/HomeLayout'
import { getInitials, getPersonColor } from '../components/palette'
import { type QuickAction, QuickActionsRow } from '../components/QuickActionsRow'
import { Tile } from '../components/Tile'
import { VisibilityDot } from '../components/VisibilityDot'
import { mockCalendar, mockFinance, mockGoals, mockTasks, mockUser } from './homeMockData'

function EmptyRow() {
  return <p className="py-2 text-[13px] text-ink-faint">Nada por aqui hoje.</p>
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Nova tarefa', icon: CheckSquare2, tone: 'mint', to: '/home/tarefas/nova' },
  { label: 'Novo compromisso', icon: CalendarDays, tone: 'sky', to: '/home/calendario?novo=1' },
  { label: 'Nova transação', icon: Wallet, tone: 'peach', to: '/home/financas?novo=1' },
  { label: 'Novo objetivo', icon: Target, tone: 'goal', to: '/home/objetivos?novo=1' },
]

export function HomeScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [tasks, setTasks] = useState(mockTasks)

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const visibleTasks = tasks.filter((t) => matchesContext(filter, t))
  const visibleCalendar = mockCalendar.filter((c) => matchesContext(filter, c))
  const visibleGoals = mockGoals.filter((g) => matchesContext(filter, g))
  const visibleFinance = mockFinance.filter((f) => matchesContext(filter, f))

  return (
    <HomeLayout>
      <div className="px-6 pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-extrabold leading-tight tracking-tight text-ink">
              Bom dia, {mockUser.firstName}
            </h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">Segunda-feira, 31 de agosto</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            aria-label="Perfil e Configurações"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill text-[14px] font-extrabold text-white transition active:scale-90"
            style={{ backgroundColor: getPersonColor(mockUser.firstName) }}
          >
            {getInitials(mockUser.firstName)}
          </button>
        </div>

        <div className="mt-5">
          <QuickActionsRow actions={QUICK_ACTIONS} />
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {visibleGoals.length === 0 ? (
            <Tile span={2}>
              <DomainLabel icon={<Target size={15} strokeWidth={2.4} />} tone="goal">
                Objetivos
              </DomainLabel>
              <EmptyRow />
            </Tile>
          ) : (
            visibleGoals.map((goal) => (
              <div
                key={goal.id}
                className="shadow-hero-goal relative col-span-2 overflow-hidden rounded-lg bg-gradient-to-br from-goal to-[#8a1c47] px-5 py-6 text-white"
              >
                <span className="tabular absolute right-5 top-5 rounded-sm bg-mint-bg px-2 py-1 text-[12px] font-extrabold text-mint-fg">
                  {goal.progress}%
                </span>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-white/70">
                  <Target size={13} strokeWidth={2.4} />
                  Objetivo em andamento
                </span>
                <h2 className="mt-2 max-w-[75%] text-[22px] font-extrabold leading-snug text-balance">
                  {goal.title}
                </h2>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-pill bg-white/25">
                  <div className="h-full rounded-pill bg-white" style={{ width: `${goal.progress}%` }} />
                </div>
                <span className="tabular mt-2 block text-[13px] font-medium text-white/80">{goal.progressLabel}</span>
              </div>
            ))
          )}

          <Tile span={2}>
            <DomainLabel icon={<CheckSquare2 size={15} strokeWidth={2.4} />} tone="mint">
              Tarefas de hoje
            </DomainLabel>
            {visibleTasks.length === 0 ? (
              <EmptyRow />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visibleTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-center gap-3 py-3 text-left transition active:scale-[0.99]"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border-2 ${
                        task.done ? 'border-accent bg-accent' : 'border-line'
                      }`}
                    >
                      {task.done ? <CheckSquare2 size={13} strokeWidth={3} className="text-white" /> : null}
                    </span>
                    <span
                      className={`flex-1 text-[15px] font-semibold ${task.done ? 'text-ink-faint line-through' : 'text-ink'}`}
                    >
                      {task.title}
                    </span>
                    <VisibilityDot context={task.context} groupId={task.groupId} />
                  </button>
                ))}
              </div>
            )}
          </Tile>

          <Tile span={2}>
            <DomainLabel icon={<CalendarDays size={12} strokeWidth={2.4} />} tone="sky" size="sm">
              Compromissos
            </DomainLabel>
            {visibleCalendar.length === 0 ? (
              <EmptyRow />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visibleCalendar.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2.5">
                    <span className="tabular shrink-0 rounded-sm bg-sky-bg px-1.5 py-0.5 text-[11px] font-bold text-sky-fg">
                      {item.time}
                    </span>
                    <span className="flex-1 text-[13px] font-medium text-ink">{item.title}</span>
                    <VisibilityDot context={item.context} groupId={item.groupId} />
                  </div>
                ))}
              </div>
            )}
          </Tile>

          <Tile span={2}>
            <DomainLabel icon={<Wallet size={12} strokeWidth={2.4} />} tone="peach" size="sm">
              Finanças
            </DomainLabel>
            {visibleFinance.length === 0 ? (
              <EmptyRow />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visibleFinance.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="flex flex-1 items-center gap-2 text-[13px] font-medium text-ink">
                      {item.title}
                      <VisibilityDot context={item.context} groupId={item.groupId} />
                    </span>
                    <span className="tabular shrink-0 rounded-sm bg-peach-bg px-1.5 py-0.5 text-[11px] font-bold text-peach-fg">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Tile>
        </div>
      </div>
    </HomeLayout>
  )
}
