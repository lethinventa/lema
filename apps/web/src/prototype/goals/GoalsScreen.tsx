import { CheckCircle2, Plus, Target } from 'lucide-react'
import { useState } from 'react'
import { ContextFilterChips, type ContextFilterValue } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { type HomeContext, mockGroup } from '../home/homeMockData'
import { GoalSheet, type GoalSheetValues } from './GoalSheet'
import { initialGoals, type MockGoal } from './goalsMockData'

function matches(filter: ContextFilterValue, context: HomeContext) {
  return filter === 'all' || filter === context
}

function GoalCard({ goal, onEdit }: { goal: MockGoal; onEdit: () => void }) {
  return (
    <Tile span={2}>
      <button type="button" onClick={onEdit} className="w-full text-left">
        <div className="flex flex-wrap items-center gap-1.5">
          {goal.done ? (
            <span className="flex items-center gap-1 rounded-sm bg-mint-bg px-1.5 py-0.5 text-[11px] font-bold text-mint-fg">
              <CheckCircle2 size={12} strokeWidth={2.6} />
              Concluído
            </span>
          ) : null}
          {goal.category ? (
            <span className="rounded-sm bg-peach-bg px-1.5 py-0.5 text-[11px] font-bold text-peach-fg">
              {goal.category}
            </span>
          ) : null}
          {goal.deadline ? (
            <span className="rounded-sm bg-sky-bg px-1.5 py-0.5 text-[11px] font-bold text-sky-fg">
              {goal.deadline}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-[16px] font-bold text-ink">{goal.title}</h3>
        {!goal.done ? (
          <>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-surface-muted">
              <div className="h-full rounded-pill bg-accent" style={{ width: `${goal.progress}%` }} />
            </div>
            <span className="mt-1.5 block text-[12px] font-semibold text-ink-muted">{goal.progress}% concluído</span>
          </>
        ) : null}
      </button>
    </Tile>
  )
}

export function GoalsScreen() {
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [goals, setGoals] = useState(initialGoals)
  const [sheet, setSheet] = useState<{ mode: 'create' } | { mode: 'edit'; goalId: string } | null>(null)

  function handleCreate(values: GoalSheetValues) {
    setGoals((prev) => [
      {
        id: `gl-${Date.now()}`,
        title: values.title,
        context: values.context,
        done: false,
        progress: 0,
        deadline: values.deadline || undefined,
        category: values.category || undefined,
      },
      ...prev,
    ])
    setSheet(null)
  }

  function handleEditSave(values: GoalSheetValues) {
    if (sheet?.mode !== 'edit') return
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === sheet.goalId
          ? {
              ...goal,
              title: values.title,
              context: values.context,
              deadline: values.deadline || undefined,
              category: values.category || undefined,
              progress: values.progress,
            }
          : goal,
      ),
    )
    setSheet(null)
  }

  function handleComplete() {
    if (sheet?.mode !== 'edit') return
    setGoals((prev) => prev.map((goal) => (goal.id === sheet.goalId ? { ...goal, done: true, progress: 100 } : goal)))
    setSheet(null)
  }

  function handleDelete() {
    if (sheet?.mode !== 'edit') return
    setGoals((prev) => prev.filter((goal) => goal.id !== sheet.goalId))
    setSheet(null)
  }

  const visible = goals.filter((g) => matches(filter, g.context))
  const active = visible.filter((g) => !g.done)
  const completed = visible.filter((g) => g.done)
  const editingGoal = sheet?.mode === 'edit' ? goals.find((g) => g.id === sheet.goalId) : undefined

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
            onClick={() => setSheet({ mode: 'create' })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
            aria-label="Novo objetivo"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {visible.length === 0 ? (
            <Tile span={2}>
              <span className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-lavender-bg text-lavender-fg">
                  <Target size={15} strokeWidth={2.4} />
                </span>
                <span className="text-[15px] font-bold text-ink">Objetivos</span>
              </span>
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra criar um objetivo.</p>
            </Tile>
          ) : (
            <>
              {active.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onEdit={() => setSheet({ mode: 'edit', goalId: goal.id })} />
              ))}
              {completed.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onEdit={() => setSheet({ mode: 'edit', goalId: goal.id })} />
              ))}
            </>
          )}
        </div>
      </div>

      {sheet?.mode === 'create' ? (
        <GoalSheet mode="create" groupName={mockGroup.name} onSave={handleCreate} onClose={() => setSheet(null)} />
      ) : null}

      {sheet?.mode === 'edit' && editingGoal ? (
        <GoalSheet
          mode="edit"
          groupName={mockGroup.name}
          done={editingGoal.done}
          initial={{
            title: editingGoal.title,
            context: editingGoal.context === 'group' ? 'group' : 'personal',
            deadline: editingGoal.deadline ?? '',
            category: editingGoal.category ?? '',
            progress: editingGoal.progress,
          }}
          onSave={handleEditSave}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </HomeLayout>
  )
}
