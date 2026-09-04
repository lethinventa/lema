import { CheckCircle2, Target, Trash2, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { getCategoryStyle } from '../components/palette'
import { Tile } from '../components/Tile'
import { TrashSheet } from '../components/TrashSheet'
import { mockGroups } from '../home/homeMockData'
import { formatDate } from '../finance/accountsMockData'
import { initialTransactions } from '../finance/financeMockData'
import { initialGoalAllocations } from './goalAllocationsMockData'
import { initialGoals, type MockGoal } from './goalsMockData'
import { getGoalProgress, getPaceInfo, getSubgoals } from './goalsSelectors'

// Lista completa/filtrável de objetivos, incluindo lixeira — destino do "Ver
// tudo" de GoalsScreen (que virou a home do módulo: resumo + atalhos +
// prévia). Ver docs/product/interaction-patterns.md.
function GoalCard({
  goal,
  progress,
  behindPace,
  onEdit,
}: {
  goal: MockGoal
  progress: number
  behindPace: boolean
  onEdit: () => void
}) {
  const category = goal.category ? getCategoryStyle(goal.category) : null
  return (
    <Tile span={2}>
      <button type="button" onClick={onEdit} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {goal.done ? (
              <span className="flex items-center gap-1 rounded-sm bg-mint-bg px-1.5 py-0.5 text-[11px] font-bold text-mint-fg">
                <CheckCircle2 size={12} strokeWidth={2.6} />
                Concluído
              </span>
            ) : null}
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
        {!goal.done ? (
          <>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-surface-muted">
              <div className="h-full rounded-pill bg-goal" style={{ width: `${progress}%` }} />
            </div>
            <span className="tabular mt-1.5 block text-[12px] font-semibold text-ink-muted">{progress}% concluído</span>
          </>
        ) : null}
      </button>
    </Tile>
  )
}

export function GoalsListScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [goals, setGoals] = useState(initialGoals)
  const [showTrash, setShowTrash] = useState(searchParams.get('lixeira') === '1')

  function handleRestoreGoal(id: string) {
    const idsToRestore = [id, ...getSubgoals(id, goals).map((g) => g.id)]
    setGoals((prev) => prev.map((g) => (idsToRestore.includes(g.id) ? { ...g, deletedAt: undefined } : g)))
  }

  function handleDeleteGoalForever(id: string) {
    const idsToRemove = [id, ...getSubgoals(id, goals).map((g) => g.id)]
    setGoals((prev) => prev.filter((g) => !idsToRemove.includes(g.id)))
  }

  const activeGoals = goals.filter((g) => !g.deletedAt)
  const trashedGoals = goals.filter((g) => !g.parentGoalId && g.deletedAt)
  const topLevel = activeGoals.filter((g) => !g.parentGoalId)
  const visible = topLevel.filter((g) => matchesContext(filter, g))
  const active = visible.filter((g) => !g.done)
  const completed = visible.filter((g) => g.done)

  return (
    <HomeLayout>
      <BackHeader
        title="Todos os objetivos"
        to="/home/objetivos"
        action={
          <button
            type="button"
            onClick={() => setShowTrash(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-pill bg-surface-muted text-ink transition active:scale-90"
            aria-label="Lixeira de objetivos"
          >
            <Trash2 size={17} strokeWidth={2.2} />
            {trashedGoals.length > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-pill bg-danger" />
            ) : null}
          </button>
        }
      />

      <div className="px-6 pb-4 pt-4">
        <div className="mb-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {visible.length === 0 ? (
            <Tile span={2}>
              <span className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-goal-soft text-goal">
                  <Target size={15} strokeWidth={2.4} />
                </span>
                <span className="text-[15px] font-bold text-ink">Objetivos</span>
              </span>
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra criar um objetivo.</p>
            </Tile>
          ) : (
            <>
              {active.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={getGoalProgress(goal, activeGoals, initialGoalAllocations, initialTransactions)}
                  behindPace={getPaceInfo(goal, initialGoalAllocations, initialTransactions).behindPace}
                  onEdit={() => navigate(`/home/objetivos/${goal.id}`)}
                />
              ))}
              {completed.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={100}
                  behindPace={false}
                  onEdit={() => navigate(`/home/objetivos/${goal.id}`)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {showTrash ? (
        <TrashSheet
          title="Lixeira · Objetivos"
          items={trashedGoals}
          getId={(g) => g.id}
          getDeletedAt={(g) => g.deletedAt!}
          renderItem={(goal) => (
            <div>
              <span className="flex items-center gap-1.5">
                <span className="text-[15px] font-semibold text-ink">{goal.title}</span>
                {getSubgoals(goal.id, goals).length > 0 ? (
                  <span className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-[11px] font-bold text-ink-muted">
                    +{getSubgoals(goal.id, goals).length} submeta{getSubgoals(goal.id, goals).length > 1 ? 's' : ''}
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block text-[12px] text-ink-faint">
                {goal.category ? `${goal.category} · ` : ''}
                {goal.context === 'group' ? mockGroups.find((g) => g.id === goal.groupId)?.name : goal.context === 'shared' ? 'Compartilhado' : 'Pessoal'}
              </span>
            </div>
          )}
          onRestore={handleRestoreGoal}
          onDeleteForever={handleDeleteGoalForever}
          onClose={() => setShowTrash(false)}
        />
      ) : null}
    </HomeLayout>
  )
}
