import { CheckCircle2, ChevronLeft, ChevronRight, Plus, Target, Trash2, TriangleAlert, X } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import { formatCurrency } from '../finance/financeMockData'
import type { MockTransaction } from '../finance/financeMockData'
import type { AllocationStatus, MockGoalAllocation } from './goalAllocationsMockData'
import type { PaceInfo } from './goalsSelectors'

export interface GoalSheetValues {
  title: string
  context: 'personal' | 'group'
  groupId?: string
  deadline: string // ISO
  category: string
  progress: number
  custoEstimado: string
}

interface SubgoalSummary {
  id: string
  title: string
  progress: number
  custoEstimado?: number
}

interface GoalSheetProps {
  mode: 'create' | 'edit'
  initial?: GoalSheetValues
  done?: boolean
  isSubgoal?: boolean
  allocations?: MockGoalAllocation[] // só RESERVED/COMMITTED — PAID vem de goalTransactions
  goalTransactions?: MockTransaction[]
  subgoals?: SubgoalSummary[]
  computedProgress?: number
  paceInfo?: PaceInfo
  parentTitle?: string
  onBack?: () => void
  onSave: (values: GoalSheetValues) => void
  onComplete?: () => void
  onDelete?: () => void
  onClose: () => void
  onAddAllocation?: (valor: number, estado: AllocationStatus) => void
  onRemoveAllocation?: (id: string) => void
  onOpenSubgoal?: (id: string) => void
  onAddSubgoal?: () => void
  onRegisterPayment?: () => void
}

// Uma seção do bloco financeiro (Reservado ou Contratado): total, itens
// lançados manualmente e um jeito rápido de adicionar mais um valor — nunca
// mistura os dois estados na mesma lista, pra não repetir a confusão do
// formulário único de antes.
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

function SubgoalCard({ subgoal, onOpen }: { subgoal: SubgoalSummary; onOpen: () => void }) {
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

export function GoalSheet({
  mode,
  initial,
  done,
  isSubgoal,
  allocations = [],
  goalTransactions = [],
  subgoals = [],
  computedProgress,
  paceInfo,
  parentTitle,
  onBack,
  onSave,
  onComplete,
  onDelete,
  onClose,
  onAddAllocation,
  onRemoveAllocation,
  onOpenSubgoal,
  onAddSubgoal,
  onRegisterPayment,
}: GoalSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: initial?.context ?? 'personal',
    groupId: initial?.groupId,
  })
  const [deadline, setDeadline] = useState(initial?.deadline ?? '')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [progress, setProgress] = useState(initial?.progress ?? 0)
  const [custoEstimado, setCustoEstimado] = useState(initial?.custoEstimado ?? '')

  const hasSubgoals = subgoals.length > 0
  const hasCusto = custoEstimado.trim().length > 0
  const reserved = allocations.filter((a) => a.estado === 'RESERVED')
  const committed = allocations.filter((a) => a.estado === 'COMMITTED')
  const paidTotal = goalTransactions.reduce((sum, t) => sum + t.amount, 0)

  function handleSave() {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      deadline,
      category: category.trim(),
      progress,
      custoEstimado: custoEstimado.trim(),
    })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[90%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />

        {onBack ? (
          <button type="button" onClick={onBack} className="mb-2 flex items-center gap-1 text-[12.5px] font-semibold text-ink-muted">
            <ChevronLeft size={14} strokeWidth={2.4} />
            Voltar para {parentTitle}
          </button>
        ) : null}

        <h2 className="text-[17px] font-bold text-ink">
          {mode === 'create' ? (isSubgoal ? 'Nova submeta' : 'Novo objetivo') : title || 'Editar objetivo'}
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            label="Título"
            placeholder="O que você quer alcançar?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-3">
            <div className="flex-1">
              <TextField
                label="Categoria (opcional)"
                placeholder="Ex.: Viagem"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <TextField label="Prazo (opcional)" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>

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
                <span className="tabular text-[12px] font-semibold text-ink-muted">{computedProgress ?? 0}% organizado</span>
              </div>

              <div className="flex flex-col divide-y divide-line">
                <AllocationBucket
                  label="Reservado"
                  hint="Separado, mas ainda não comprometido."
                  items={reserved}
                  onAdd={(valor) => onAddAllocation?.(valor, 'RESERVED')}
                  onRemove={(id) => onRemoveAllocation?.(id)}
                />
                <AllocationBucket
                  label="Contratado"
                  hint="Já tem compromisso fechado, mas o dinheiro ainda não saiu."
                  items={committed}
                  onAdd={(valor) => onAddAllocation?.(valor, 'COMMITTED')}
                  onRemove={(id) => onRemoveAllocation?.(id)}
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
                  {onRegisterPayment ? (
                    <button
                      type="button"
                      onClick={onRegisterPayment}
                      className="mt-2 flex items-center gap-1.5 text-[12.5px] font-bold text-goal"
                    >
                      <Plus size={13} strokeWidth={2.6} />
                      Registrar transação vinculada
                    </button>
                  ) : null}
                </div>
              </div>

              {paceInfo?.idealPerMonth != null ? (
                <p className="tabular mt-1 text-[12px] font-semibold text-ink-muted">
                  Ideal por mês: {formatCurrency(paceInfo.idealPerMonth)}
                </p>
              ) : null}
              {paceInfo?.deadlinePassed ? (
                <p className="mt-1 text-[12px] font-semibold text-danger">Prazo vencido — reveja a data.</p>
              ) : null}
              {paceInfo?.behindPace ? (
                <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-danger">
                  <TriangleAlert size={13} strokeWidth={2.4} />
                  Reveja sua expectativa — o ritmo atual não bate com o prazo.
                </p>
              ) : null}
            </div>
          ) : null}

          {mode === 'edit' && !isSubgoal ? (
            <div className="rounded-md border border-line p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-bold text-ink">Submetas</span>
                <button
                  type="button"
                  onClick={onAddSubgoal}
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
                    <SubgoalCard key={sub.id} subgoal={sub} onOpen={() => onOpenSubgoal?.(sub.id)} />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={title.trim().length === 0} onClick={handleSave}>
            {mode === 'create' ? (isSubgoal ? 'Criar submeta' : 'Criar objetivo') : 'Salvar alterações'}
          </PrimaryButton>

          {mode === 'edit' && onComplete ? (
            <>
              <GhostButton onClick={onComplete} className="flex items-center justify-center gap-1.5 text-goal">
                <CheckCircle2 size={16} strokeWidth={2.2} />
                Marcar como concluído
              </GhostButton>
              <p className="-mt-1 text-center text-[11px] text-ink-faint">Concluir um objetivo não pode ser desfeito.</p>
            </>
          ) : null}

          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={onDelete} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              Excluir objetivo
            </GhostButton>
          ) : (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          )}
        </div>
      </div>
    </div>
  )
}
