import { CheckCircle2, Plus, Target, Trash2, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { initialCategories } from '../categories/categoriesMockData'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { getCategoryStyle } from '../components/palette'
import { Tile } from '../components/Tile'
import { TrashSheet } from '../components/TrashSheet'
import { VisibilityDot } from '../components/VisibilityDot'
import { mockGroups } from '../home/homeMockData'
import { formatDate, formatDateLabel, initialAccounts, MOCK_TODAY, parseAmount } from '../finance/accountsMockData'
import { initialTransactions, type MockTransaction } from '../finance/financeMockData'
import { TransactionSheet, type TransactionSheetValues } from '../finance/TransactionSheet'
import { type AllocationStatus, initialGoalAllocations, type MockGoalAllocation } from './goalAllocationsMockData'
import { GoalSheet, type GoalSheetValues } from './GoalSheet'
import { initialGoals, type MockGoal } from './goalsMockData'
import { getGoalProgress, getGoalTransactions, getPaceInfo, getSubgoals } from './goalsSelectors'

const TODAY_ISO = MOCK_TODAY.toISOString().slice(0, 10)

// Uma pilha, não um único valor: entrar numa submeta ou registrar uma
// transação vinculada empilha sobre o sheet atual em vez de abrir por cima
// dele. Fechar pelo fundo (ou "Cancelar") sempre esvazia tudo; o "← Voltar"
// dentro do sheet desempilha só um nível — é isso que resolve o
// "empilhamento estranho, difícil de navegar de volta" apontado no objetivo.
type SheetEntry =
  | { kind: 'goal'; mode: 'create'; parentGoalId?: string }
  | { kind: 'goal'; mode: 'edit'; goalId: string }
  | { kind: 'transaction'; goalId: string }

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
          <VisibilityDot context={goal.context} groupId={goal.groupId} className="mt-1 shrink-0" />
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

export function GoalsScreen() {
  const [searchParams] = useSearchParams()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [goals, setGoals] = useState(initialGoals)
  const [allocations, setAllocations] = useState<MockGoalAllocation[]>(initialGoalAllocations)
  const [transactions, setTransactions] = useState<MockTransaction[]>(initialTransactions)
  const [categories, setCategories] = useState<string[]>(initialCategories)
  // Atalho rápido da Home ("Novo objetivo") entra aqui via ?novo=1, pra
  // abrir o sheet de criação já na chegada em vez de exigir um segundo toque.
  const [stack, setStack] = useState<SheetEntry[]>(searchParams.get('novo') ? [{ kind: 'goal', mode: 'create' }] : [])
  const [showTrash, setShowTrash] = useState(false)

  function handleAddCategory(category: string) {
    setCategories((prev) => (prev.includes(category) ? prev : [...prev, category]))
  }

  const top = stack[stack.length - 1]

  function pushEntry(entry: SheetEntry) {
    setStack((prev) => [...prev, entry])
  }
  function popOne() {
    setStack((prev) => prev.slice(0, -1))
  }
  function closeAll() {
    setStack([])
  }

  function handleCreateGoal(values: GoalSheetValues) {
    if (top?.kind !== 'goal' || top.mode !== 'create') return
    const id = `gl-${Date.now()}`
    const parentGoalId = top.parentGoalId
    setGoals((prev) => [
      ...prev,
      {
        id,
        title: values.title,
        context: values.context,
        groupId: values.groupId,
        done: false,
        progress: values.progress,
        deadline: values.deadline || undefined,
        category: values.category || undefined,
        custoEstimado: values.custoEstimado ? parseAmount(values.custoEstimado) : undefined,
        createdAt: TODAY_ISO,
        parentGoalId,
      },
    ])
    if (parentGoalId) popOne()
    else closeAll()
  }

  function handleEditGoalSave(values: GoalSheetValues) {
    if (top?.kind !== 'goal' || top.mode !== 'edit') return
    const { goalId } = top
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              title: values.title,
              context: values.context,
              groupId: values.groupId,
              deadline: values.deadline || undefined,
              category: values.category || undefined,
              progress: values.progress,
              custoEstimado: values.custoEstimado ? parseAmount(values.custoEstimado) : undefined,
            }
          : goal,
      ),
    )
    const editedGoal = goals.find((g) => g.id === goalId)
    if (editedGoal?.parentGoalId) popOne()
    else closeAll()
  }

  function handleComplete() {
    if (top?.kind !== 'goal' || top.mode !== 'edit') return
    const { goalId } = top
    setGoals((prev) => prev.map((goal) => (goal.id === goalId ? { ...goal, done: true, progress: 100 } : goal)))
    const goal = goals.find((g) => g.id === goalId)
    if (goal?.parentGoalId) popOne()
    else closeAll()
  }

  function handleDelete() {
    if (top?.kind !== 'goal' || top.mode !== 'edit') return
    const { goalId } = top
    const goal = goals.find((g) => g.id === goalId)
    // Cascata (PD-007): trashear um objetivo-pai leva as submetas junto.
    // Alocações e transações vinculadas não são tocadas — só somem de vista
    // enquanto o objetivo está na lixeira, voltam intactas ao restaurar.
    const idsToTrash = [goalId, ...getSubgoals(goalId, goals).map((g) => g.id)]
    setGoals((prev) => prev.map((g) => (idsToTrash.includes(g.id) ? { ...g, deletedAt: TODAY_ISO } : g)))
    if (goal?.parentGoalId) popOne()
    else closeAll()
  }

  function handleRestoreGoal(id: string) {
    const idsToRestore = [id, ...getSubgoals(id, goals).map((g) => g.id)]
    setGoals((prev) => prev.map((g) => (idsToRestore.includes(g.id) ? { ...g, deletedAt: undefined } : g)))
  }

  function handleDeleteGoalForever(id: string) {
    const idsToRemove = [id, ...getSubgoals(id, goals).map((g) => g.id)]
    setGoals((prev) => prev.filter((g) => !idsToRemove.includes(g.id)))
    setAllocations((prev) => prev.filter((a) => !idsToRemove.includes(a.goalId)))
  }

  function handleAddAllocation(valor: number, estado: AllocationStatus) {
    if (top?.kind !== 'goal' || top.mode !== 'edit') return
    const id = `ga-${Date.now()}`
    setAllocations((prev) => [...prev, { id, goalId: top.goalId, valor, estado }])
  }

  function handleRemoveAllocation(id: string) {
    setAllocations((prev) => prev.filter((a) => a.id !== id))
  }

  // Registrar uma transação vinculada volta pro objetivo (não fecha tudo) —
  // é um passo dentro do fluxo do objetivo, não uma saída dele.
  function handleCreateLinkedTransaction(values: TransactionSheetValues) {
    if (top?.kind !== 'transaction') return
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        title: values.title,
        category: values.category,
        context: values.context,
        type: values.type,
        amount: parseAmount(values.amount),
        dateLabel: formatDateLabel(values.date),
        date: values.date,
        payer: values.payer || undefined,
        accountId: values.accountId || undefined,
        goalId: values.goalId || top.goalId,
        paymentMethod: values.paymentMethod || undefined,
      },
      ...prev,
    ])
    popOne()
  }

  const activeGoals = goals.filter((g) => !g.deletedAt)
  const trashedGoals = goals.filter((g) => !g.parentGoalId && g.deletedAt)
  const topLevel = activeGoals.filter((g) => !g.parentGoalId)
  const visible = topLevel.filter((g) => matchesContext(filter, g))
  const active = visible.filter((g) => !g.done)
  const completed = visible.filter((g) => g.done)

  const editingGoal = top?.kind === 'goal' && top.mode === 'edit' ? goals.find((g) => g.id === top.goalId) : undefined
  const parentEntry = stack.length >= 2 ? stack[stack.length - 2] : undefined
  const parentTitle =
    parentEntry?.kind === 'goal' && parentEntry.mode === 'edit' ? goals.find((g) => g.id === parentEntry.goalId)?.title : undefined
  const goalOptions = activeGoals.filter((g) => !g.done).map((g) => ({ id: g.id, title: g.title }))

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
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTrash(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-pill text-ink-muted transition active:scale-90"
              aria-label="Lixeira de objetivos"
            >
              <Trash2 size={19} strokeWidth={2.2} />
              {trashedGoals.length > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-pill bg-danger" />
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setStack([{ kind: 'goal', mode: 'create' }])}
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
              aria-label="Novo objetivo"
            >
              <Plus size={20} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
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
                  progress={getGoalProgress(goal, activeGoals, allocations, transactions)}
                  behindPace={getPaceInfo(goal, allocations, transactions).behindPace}
                  onEdit={() => setStack([{ kind: 'goal', mode: 'edit', goalId: goal.id }])}
                />
              ))}
              {completed.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  progress={100}
                  behindPace={false}
                  onEdit={() => setStack([{ kind: 'goal', mode: 'edit', goalId: goal.id }])}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {top?.kind === 'goal' && top.mode === 'create' ? (
        <GoalSheet
          mode="create"
          categoryOptions={categories}
          onAddCategory={handleAddCategory}
          isSubgoal={!!top.parentGoalId}
          parentTitle={parentTitle}
          onBack={stack.length > 1 ? popOne : undefined}
          onSave={handleCreateGoal}
          onClose={closeAll}
        />
      ) : null}

      {top?.kind === 'goal' && top.mode === 'edit' && editingGoal ? (
        <GoalSheet
          key={editingGoal.id}
          mode="edit"
          categoryOptions={categories}
          onAddCategory={handleAddCategory}
          done={editingGoal.done}
          isSubgoal={!!editingGoal.parentGoalId}
          allocations={allocations.filter((a) => a.goalId === editingGoal.id)}
          goalTransactions={getGoalTransactions(editingGoal.id, transactions)}
          subgoals={getSubgoals(editingGoal.id, activeGoals).map((sub) => ({
            id: sub.id,
            title: sub.title,
            progress: getGoalProgress(sub, activeGoals, allocations, transactions),
            custoEstimado: sub.custoEstimado,
          }))}
          computedProgress={getGoalProgress(editingGoal, activeGoals, allocations, transactions)}
          paceInfo={getPaceInfo(editingGoal, allocations, transactions)}
          parentTitle={parentTitle}
          onBack={stack.length > 1 ? popOne : undefined}
          initial={{
            title: editingGoal.title,
            context: editingGoal.context === 'group' ? 'group' : 'personal',
            groupId: editingGoal.groupId,
            deadline: editingGoal.deadline ?? '',
            category: editingGoal.category ?? '',
            progress: editingGoal.progress,
            custoEstimado: editingGoal.custoEstimado ? editingGoal.custoEstimado.toString().replace('.', ',') : '',
          }}
          onSave={handleEditGoalSave}
          onComplete={handleComplete}
          onDelete={handleDelete}
          onClose={closeAll}
          onAddAllocation={handleAddAllocation}
          onRemoveAllocation={handleRemoveAllocation}
          onOpenSubgoal={(id) => pushEntry({ kind: 'goal', mode: 'edit', goalId: id })}
          onAddSubgoal={() => pushEntry({ kind: 'goal', mode: 'create', parentGoalId: editingGoal.id })}
          onRegisterPayment={() => pushEntry({ kind: 'transaction', goalId: editingGoal.id })}
        />
      ) : null}

      {top?.kind === 'transaction' ? (
        <TransactionSheet
          mode="create"
          accountOptions={initialAccounts}
          goalOptions={goalOptions}
          categoryOptions={categories}
          onAddCategory={handleAddCategory}
          initial={{
            title: '',
            category: '',
            context: 'personal',
            type: 'despesa',
            amount: '',
            date: TODAY_ISO,
            payer: '',
            accountId: '',
            installments: '',
            recurs: false,
            recurUntil: '',
            goalId: top.goalId,
            paymentMethod: '',
          }}
          onSave={handleCreateLinkedTransaction}
          onClose={popOne}
        />
      ) : null}

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
