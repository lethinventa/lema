import { CheckCircle2, ChevronRight, Plus, Target, Trash2, TriangleAlert, X } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { CategoryPicker } from '../components/CategoryPicker'
import { TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import { initialCategories } from '../categories/categoriesMockData'
import { parseAmount } from '../finance/accountsMockData'
import { formatCurrency, initialTransactions } from '../finance/financeMockData'
import { TODAY_ISO } from '../calendar/dateUtils'
import { type AllocationStatus, initialGoalAllocations, type MockGoalAllocation } from './goalAllocationsMockData'
import { initialGoals } from './goalsMockData'
import { getGoalProgress, getGoalTransactions, getPaceInfo, getSubgoals } from './goalsSelectors'

// Criar/editar/detalhar objetivo é página cheia, não bottom sheet (ver
// docs/product/interaction-patterns.md). Era o sheet mais complexo do
// protótipo (a pilha goal→submeta→transação vinculada de GoalsScreen) — vira
// navegação de verdade: submeta é só outro objetivo (mesma página, filtrado
// por parentGoalId), "voltar" do objetivo pai é o BackHeader normal, e
// "registrar transação vinculada" sai daqui de vez, pra TransactionFormScreen
// (?objetivo=<goalId>&voltar=<esta página>) — GoalsScreen não precisa mais
// saber nada sobre o formulário de transação.

function editPath(goalId: string) {
  return `/home/objetivos/${goalId}/editar`
}

function AllocationBucket({
  label,
  hint,
  items,
  onAdd,
  onRemove,
}: {
  label: string
  hint: string
  items: MockGoalAllocation[]
  onAdd: (valor: number) => void
  onRemove: (id: string) => void
}) {
  const [value, setValue] = useState('')
  const total = items.reduce((sum, a) => sum + a.valor, 0)

  function handleAdd() {
    const parsed = Number.parseFloat(value.replace(/\./g, '').replace(',', '.'))
    if (!Number.isFinite(parsed) || parsed <= 0) return
    onAdd(parsed)
    setValue('')
  }

  return (
    <div className="py-3 first:pt-0">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-ink">{label}</span>
        <span className="tabular text-[13px] font-bold text-ink">{formatCurrency(total)}</span>
      </div>
      <p className="mt-0.5 text-[11px] text-ink-faint">{hint}</p>

      {items.length > 0 ? (
        <div className="mt-2 flex flex-col divide-y divide-line">
          {items.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 py-1.5">
              <span className="tabular text-[12.5px] font-semibold text-ink">{formatCurrency(a.valor)}</span>
              <button
                type="button"
                onClick={() => onRemove(a.id)}
                aria-label="Remover valor"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill text-ink-faint"
              >
                <X size={13} strokeWidth={2.4} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-2 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ex.: 500,00"
          inputMode="decimal"
          className="h-10 flex-1 rounded-md border border-line bg-surface px-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-ink/30 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-goal-soft text-goal"
          aria-label={`Adicionar a ${label.toLowerCase()}`}
        >
          <Plus size={16} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  )
}

function SubgoalCard({
  subgoal,
  onOpen,
}: {
  subgoal: { id: string; title: string; progress: number; custoEstimado?: number }
  onOpen: () => void
}) {
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 rounded-md border border-line p-2.5 text-left">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-goal-soft text-goal">
        <Target size={14} strokeWidth={2.4} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-ink">{subgoal.title}</span>
        <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-pill bg-surface-muted">
          <span className="block h-full rounded-pill bg-goal" style={{ width: `${subgoal.progress}%` }} />
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="tabular text-[12px] font-bold text-ink-muted">{subgoal.progress}%</span>
        {subgoal.custoEstimado ? (
          <span className="tabular text-[10.5px] font-medium text-ink-faint">{formatCurrency(subgoal.custoEstimado)}</span>
        ) : null}
      </span>
      <ChevronRight size={14} strokeWidth={2.2} className="shrink-0 text-ink-faint" />
    </button>
  )
}

export function GoalFormScreen() {
  const { goalId } = useParams<{ goalId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mode: 'create' | 'edit' = goalId ? 'edit' : 'create'
  const editingGoal = goalId ? initialGoals.find((g) => g.id === goalId) : undefined
  const parentGoalId = mode === 'create' ? (searchParams.get('submeta') ?? undefined) : editingGoal?.parentGoalId
  const parentGoal = parentGoalId ? initialGoals.find((g) => g.id === parentGoalId) : undefined
  const isSubgoal = !!parentGoalId
  const backTo = isSubgoal && parentGoalId ? editPath(parentGoalId) : '/home/objetivos'

  const activeGoals = initialGoals.filter((g) => !g.deletedAt)
  const subgoals =
    mode === 'edit' && goalId
      ? getSubgoals(goalId, activeGoals).map((sub) => ({
          id: sub.id,
          title: sub.title,
          progress: getGoalProgress(sub, activeGoals, initialGoalAllocations, initialTransactions),
          custoEstimado: sub.custoEstimado,
        }))
      : []
  const goalTransactions = mode === 'edit' && goalId ? getGoalTransactions(goalId, initialTransactions) : []
  const computedProgress = mode === 'edit' && editingGoal ? getGoalProgress(editingGoal, activeGoals, initialGoalAllocations, initialTransactions) : 0
  const paceInfo = mode === 'edit' && editingGoal ? getPaceInfo(editingGoal, initialGoalAllocations, initialTransactions) : undefined

  const [title, setTitle] = useState(editingGoal?.title ?? '')
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: editingGoal?.context === 'group' ? 'group' : parentGoal?.context === 'group' ? 'group' : 'personal',
    groupId: editingGoal?.groupId ?? parentGoal?.groupId,
  })
  const [deadline, setDeadline] = useState(editingGoal?.deadline ?? '')
  const [category, setCategory] = useState(editingGoal?.category ?? '')
  const [progress, setProgress] = useState(editingGoal?.progress ?? 0)
  const [custoEstimado, setCustoEstimado] = useState(editingGoal?.custoEstimado ? editingGoal.custoEstimado.toString().replace('.', ',') : '')
  const [allocations, setAllocations] = useState<MockGoalAllocation[]>(
    goalId ? initialGoalAllocations.filter((a) => a.goalId === goalId) : [],
  )

  if (mode === 'edit' && !editingGoal) {
    return <Navigate to="/home/objetivos" replace />
  }

  const done = editingGoal?.done ?? false
  const hasSubgoals = subgoals.length > 0
  const hasCusto = custoEstimado.trim().length > 0
  const reserved = allocations.filter((a) => a.estado === 'RESERVED')
  const committed = allocations.filter((a) => a.estado === 'COMMITTED')
  const paidTotal = goalTransactions.reduce((sum, t) => sum + t.amount, 0)

  function handleAddCategory(newCategory: string) {
    setCategories((prev) => (prev.includes(newCategory) ? prev : [...prev, newCategory]))
    if (!initialCategories.includes(newCategory)) initialCategories.push(newCategory)
  }

  function handleAddAllocation(valor: number, estado: AllocationStatus) {
    if (!goalId) return
    const entry: MockGoalAllocation = { id: `ga-${Date.now()}`, goalId, valor, estado }
    initialGoalAllocations.push(entry)
    setAllocations((prev) => [...prev, entry])
  }

  function handleRemoveAllocation(id: string) {
    const idx = initialGoalAllocations.findIndex((a) => a.id === id)
    if (idx !== -1) initialGoalAllocations.splice(idx, 1)
    setAllocations((prev) => prev.filter((a) => a.id !== id))
  }

  function handleSave() {
    if (!title.trim()) return
    const shared = {
      title: title.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      deadline: deadline || undefined,
      category: category.trim() || undefined,
      progress,
      custoEstimado: custoEstimado.trim() ? parseAmount(custoEstimado) : undefined,
    }

    const target = goalId ? initialGoals.find((g) => g.id === goalId) : undefined
    if (target) {
      Object.assign(target, shared)
    } else {
      const newGoal = { id: `gl-${Date.now()}`, done: false, createdAt: TODAY_ISO, parentGoalId, ...shared }
      initialGoals.push(newGoal)
    }
    navigate(backTo)
  }

  function handleComplete() {
    const target = goalId ? initialGoals.find((g) => g.id === goalId) : undefined
    if (!target) return
    target.done = true
    target.progress = 100
    navigate(backTo)
  }

  function handleDelete() {
    if (!goalId) return
    // Cascata (PD-007): trashear um objetivo-pai leva as submetas junto.
    const idsToTrash = [goalId, ...getSubgoals(goalId, initialGoals).map((g) => g.id)]
    for (const id of idsToTrash) {
      const target = initialGoals.find((g) => g.id === id)
      if (target) target.deletedAt = TODAY_ISO
    }
    navigate(backTo)
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader
        title={mode === 'create' ? (isSubgoal ? 'Nova submeta' : 'Novo objetivo') : title || 'Editar objetivo'}
        subtitle={isSubgoal && parentGoal ? `Submeta de ${parentGoal.title}` : undefined}
        to={backTo}
      />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="flex flex-col gap-4">
          <TextField label="Título" placeholder="O que você quer alcançar?" value={title} onChange={(e) => setTitle(e.target.value)} />

          <CategoryPicker label="Categoria (opcional)" categories={categories} value={category} onChange={setCategory} onAddCategory={handleAddCategory} />

          <TextField label="Prazo (opcional)" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

          <VisibilityPicker value={visibility} onChange={setVisibility} />

          {!hasSubgoals ? (
            <TextField
              label="Custo estimado (opcional)"
              placeholder="Ex.: 5000,00"
              inputMode="decimal"
              value={custoEstimado}
              onChange={(e) => setCustoEstimado(e.target.value)}
              hint="Deixe em branco se este não for um objetivo financeiro."
            />
          ) : null}

          {mode === 'edit' && !done && !hasSubgoals && !hasCusto ? (
            <div>
              <span className="mb-2 flex items-center justify-between text-[13px] font-medium text-ink-muted">
                Progresso
                <span className="tabular font-bold text-ink">{progress}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-goal"
              />
            </div>
          ) : null}

          {mode === 'edit' && !hasSubgoals && hasCusto ? (
            <div className="rounded-md border border-line p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[13px] font-bold text-ink">Progresso financeiro</span>
                <span className="tabular text-[12px] font-semibold text-ink-muted">{computedProgress}% organizado</span>
              </div>

              <div className="flex flex-col divide-y divide-line">
                <AllocationBucket
                  label="Reservado"
                  hint="Separado, mas ainda não comprometido."
                  items={reserved}
                  onAdd={(valor) => handleAddAllocation(valor, 'RESERVED')}
                  onRemove={handleRemoveAllocation}
                />
                <AllocationBucket
                  label="Contratado"
                  hint="Já tem compromisso fechado, mas o dinheiro ainda não saiu."
                  items={committed}
                  onAdd={(valor) => handleAddAllocation(valor, 'COMMITTED')}
                  onRemove={handleRemoveAllocation}
                />

                <div className="py-3 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-mint-fg">Pago</span>
                    <span className="tabular text-[13px] font-bold text-ink">{formatCurrency(paidTotal)}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-ink-faint">
                    Dinheiro que já saiu de verdade — vem das transações vinculadas a este objetivo em Finanças.
                  </p>
                  {goalTransactions.length > 0 ? (
                    <div className="mt-2 flex flex-col divide-y divide-line">
                      {goalTransactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between gap-2 py-1.5">
                          <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{t.title}</span>
                          <span className="tabular shrink-0 text-[12.5px] font-bold text-ink">{formatCurrency(t.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[12px] text-ink-faint">Nenhuma transação vinculada ainda.</p>
                  )}
                  {goalId ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/home/financas/nova?objetivo=${goalId}&voltar=${encodeURIComponent(editPath(goalId))}`)}
                      className="mt-2 flex items-center gap-1.5 text-[12.5px] font-bold text-ink"
                    >
                      <Plus size={13} strokeWidth={2.6} />
                      Registrar transação vinculada
                    </button>
                  ) : null}
                </div>
              </div>

              {paceInfo?.idealPerMonth != null ? (
                <p className="tabular mt-1 text-[12px] font-semibold text-ink-muted">Ideal por mês: {formatCurrency(paceInfo.idealPerMonth)}</p>
              ) : null}
              {paceInfo?.deadlinePassed ? <p className="mt-1 text-[12px] font-semibold text-danger">Prazo vencido — reveja a data.</p> : null}
              {paceInfo?.behindPace ? (
                <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-danger">
                  <TriangleAlert size={13} strokeWidth={2.4} />
                  Reveja sua expectativa — o ritmo atual não bate com o prazo.
                </p>
              ) : null}
            </div>
          ) : null}

          {mode === 'edit' && !isSubgoal && goalId ? (
            <div className="rounded-md border border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-bold text-ink">Submetas</span>
                <button
                  type="button"
                  onClick={() => navigate(`/home/objetivos/novo?submeta=${goalId}`)}
                  className="flex h-7 w-7 items-center justify-center rounded-pill bg-goal-soft text-goal"
                  aria-label="Adicionar submeta"
                >
                  <Plus size={15} strokeWidth={2.4} />
                </button>
              </div>
              {subgoals.length === 0 ? (
                <p className="py-1 text-[12px] text-ink-faint">Nenhuma submeta ainda.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {subgoals.map((sub) => (
                    <SubgoalCard key={sub.id} subgoal={sub} onOpen={() => navigate(editPath(sub.id))} />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <PrimaryButton disabled={title.trim().length === 0} onClick={handleSave}>
          {mode === 'create' ? (isSubgoal ? 'Criar submeta' : 'Criar objetivo') : 'Salvar alterações'}
        </PrimaryButton>

        {mode === 'edit' && !done ? (
          <>
            <GhostButton onClick={handleComplete} className="flex items-center justify-center gap-1.5">
              <CheckCircle2 size={16} strokeWidth={2.2} />
              Marcar como concluído
            </GhostButton>
            <p className="-mt-1 text-center text-[11px] text-ink-faint">Concluir um objetivo não pode ser desfeito.</p>
          </>
        ) : null}

        {mode === 'edit' ? (
          <GhostButton onClick={handleDelete} className="flex items-center justify-center gap-1.5 text-danger">
            <Trash2 size={16} strokeWidth={2.2} />
            Excluir objetivo
          </GhostButton>
        ) : null}
      </div>
    </div>
  )
}
