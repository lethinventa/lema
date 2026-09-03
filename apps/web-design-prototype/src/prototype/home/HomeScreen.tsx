import { CalendarDays, CheckSquare2, Target, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { getInitials, getPersonColor } from '../components/palette'
import { type QuickAction, QuickActionsRow } from '../components/QuickActionsRow'
import { SectionHeader } from '../components/SectionHeader'
import { Tile } from '../components/Tile'
import { VisibilityDot } from '../components/VisibilityDot'
import { mockCalendar, mockFinance, mockGoals, mockTasks, mockUser } from './homeMockData'

function EmptyRow() {
  return <p className="py-2 text-[13px] text-ink-faint">Nada por aqui hoje.</p>
}

// Labels curtos de propósito (uma palavra, como "Pix"/"Pagar"/"Cartões" no
// Inter) — em vez de "Nova tarefa"/"Novo compromisso", evita quebra de
// linha desalinhada entre colunas na largura de 64px do círculo.
const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Tarefa', icon: CheckSquare2, to: '/home/tarefas/nova' },
  { label: 'Agenda', icon: CalendarDays, to: '/home/calendario?novo=1' },
  { label: 'Transação', icon: Wallet, to: '/home/financas?novo=1' },
  { label: 'Objetivo', icon: Target, to: '/home/objetivos?novo=1' },
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
  const pendingCount = visibleTasks.filter((t) => !t.done).length

  const pulse =
    pendingCount === 0 && visibleCalendar.length === 0
      ? 'Nada urgente por aqui.'
      : [
          pendingCount > 0 ? `${pendingCount} tarefa${pendingCount > 1 ? 's' : ''} pendente${pendingCount > 1 ? 's' : ''}` : null,
          visibleCalendar.length > 0 ? `${visibleCalendar.length} compromisso${visibleCalendar.length > 1 ? 's' : ''}` : null,
        ]
          .filter(Boolean)
          .join(' · ')

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
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        {/* Card "Hoje" — equivalente ao card de saldo do Inter (identidade +
            ações primárias num único bloco elevado), adaptado: Lema não tem
            saldo único, então o número que ancora o card é o pulso do dia. */}
        <Tile className="mt-4 !p-5">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-ink-faint">Hoje</span>
          <p className="mt-1 text-[16px] font-bold text-ink">{pulse}</p>
          <div className="-mx-5 mt-4 border-t border-line px-5 pt-4">
            <QuickActionsRow actions={QUICK_ACTIONS} />
          </div>
        </Tile>

        <div className="mt-4 flex flex-col gap-4">
          {visibleGoals.length === 0 ? null : (
            visibleGoals.map((goal) => (
              <div
                key={goal.id}
                className="shadow-hero-goal relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-goal to-[#8a1c47] px-5 py-6 text-white"
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

          <Tile>
            <SectionHeader title="Tarefas de hoje" to="/home/tarefas" />
            {visibleTasks.length === 0 ? (
              <EmptyRow />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visibleTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-center gap-3 py-2.5 text-left transition active:scale-[0.99]"
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

          <Tile>
            <SectionHeader title="Compromissos" to="/home/calendario" />
            {visibleCalendar.length === 0 ? (
              <EmptyRow />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visibleCalendar.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2">
                    <span className="tabular shrink-0 rounded-sm bg-sky-bg px-1.5 py-0.5 text-[11px] font-bold text-sky-fg">
                      {item.time}
                    </span>
                    <span className="flex-1 text-[14px] font-semibold text-ink">{item.title}</span>
                    <VisibilityDot context={item.context} groupId={item.groupId} />
                  </div>
                ))}
              </div>
            )}
          </Tile>

          <Tile>
            <SectionHeader title="Finanças" to="/home/financas" />
            {visibleFinance.length === 0 ? (
              <EmptyRow />
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {visibleFinance.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 py-2">
                    <span className="flex flex-1 items-center gap-2 text-[14px] font-semibold text-ink">
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
