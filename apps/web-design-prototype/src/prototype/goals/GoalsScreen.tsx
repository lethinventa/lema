import { CheckCircle2, Plus, Target, Trash2, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { getCategoryStyle } from '../components/palette'
import { type QuickAction, QuickActionsRow } from '../components/QuickActionsRow'
import { SectionHeader } from '../components/SectionHeader'
import { Tile } from '../components/Tile'
import { formatDate } from '../finance/accountsMockData'
import { initialTransactions } from '../finance/financeMockData'
import { initialGoalAllocations } from './goalAllocationsMockData'
import { initialGoals, type MockGoal } from './goalsMockData'
import { getGoalProgress, getPaceInfo } from './goalsSelectors'

// Home do módulo Objetivos: resumo geral + atalhos + prévia da lista + "Ver
// tudo" (GoalsListScreen, que tem a lista completa/filtrável + lixeira) —
// mesma composição usada em FinanceScreen (ver
// docs/product/interaction-patterns.md).
const PREVIEW_COUNT = 4

function GoalCard({
  goal,
  progress,
  behindPace,
  onOpen,
}: {
  goal: MockGoal
  progress: number
  behindPace: boolean
  onOpen: () => void
}) {
  const category = goal.category ? getCategoryStyle(goal.category) : null
  return (
    <Tile span={2}>
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {category ? (
              <span className={`rounded-sm px-1.5 py-0.5 text-[11px] font-bold ${category.bg} ${category.fg}`}>
                {goal.category}
              </span>
            ) : null}
            {goal.deadline ? (
              <span className="rounded-sm bg-sky-bg px-1.5 py-0.5 text-[11px] font-bold text-sky-fg">
                {formatDate(goal.deadline)}
              </span>
            ) : null}
            {behindPace ? (
              <span className="flex items-center gap-1 rounded-sm bg-peach-bg px-1.5 py-0.5 text-[11px] font-bold text-peach-fg">
                <TriangleAlert size={11} strokeWidth={2.6} />
                Reveja o ritmo
              </span>
            ) : null}
          </div>
        </div>
        <h3 className="mt-2 text-[16px] font-bold text-ink">{goal.title}</h3>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-surface-muted">
          <div className="h-full rounded-pill bg-goal" style={{ width: `${progress}%` }} />
        </div>
        <span className="tabular mt-1.5 block text-[12px] font-semibold text-ink-muted">{progress}% concluído</span>
      </button>
    </Tile>
  )
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Novo objetivo', icon: Target, to: '/home/objetivos/novo' },
  { label: 'Lixeira', icon: Trash2, to: '/home/objetivos/todos?lixeira=1' },
]

export function GoalsScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ContextFilterValue>('all')

  const activeGoals = initialGoals.filter((g) => !g.deletedAt)
  const topLevel = activeGoals.filter((g) => !g.parentGoalId)
  const visible = topLevel.filter((g) => matchesContext(filter, g))
  const active = visible.filter((g) => !g.done)
  const completedCount = visible.filter((g) => g.done).length
  const preview = active.slice(0, PREVIEW_COUNT)
  const avgProgress = active.length
    ? Math.round(
        active.reduce((sum, g) => sum + getGoalProgress(g, activeGoals, initialGoalAllocations, initialTransactions), 0) /
          active.length,
      )
    : 0

  return (
    <HomeLayout>
      <div className="px-6 pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight text-ink">Objetivos</h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {active.length === 0 ? 'Nenhum objetivo em andamento' : `${active.length} em andamento`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/home/objetivos/novo')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-ink transition active:scale-90"
            aria-label="Novo objetivo"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <Tile className="mt-4 flex items-center justify-around text-center">
          <div>
            <span className="tabular block text-[20px] font-extrabold text-ink">{active.length}</span>
            <span className="text-[11px] font-semibold text-ink-muted">Em andamento</span>
          </div>
          <div>
            <span className="tabular block text-[20px] font-extrabold text-ink">{avgProgress}%</span>
            <span className="text-[11px] font-semibold text-ink-muted">Progresso médio</span>
          </div>
          <div>
            <span className="tabular flex items-center justify-center gap-1 text-[20px] font-extrabold text-ink">
              <CheckCircle2 size={16} strokeWidth={2.4} className="text-mint-fg" />
              {completedCount}
            </span>
            <span className="text-[11px] font-semibold text-ink-muted">Concluídos</span>
          </div>
        </Tile>

        <div className="mt-4">
          <QuickActionsRow actions={QUICK_ACTIONS} />
        </div>

        <div className="mt-6">
          <SectionHeader title="Objetivos" to="/home/objetivos/todos" />
          {preview.length === 0 ? (
            <Tile>
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra criar um objetivo.</p>
            </Tile>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {preview.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={getGoalProgress(goal, activeGoals, initialGoalAllocations, initialTransactions)}
                  behindPace={getPaceInfo(goal, initialGoalAllocations, initialTransactions).behindPace}
                  onOpen={() => navigate(`/home/objetivos/${goal.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  )
}
