import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { PrimaryButton } from '../components/Buttons'
import { CategoryPicker } from '../components/CategoryPicker'
import { TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import { initialCategories } from '../categories/categoriesMockData'
import { parseAmount } from '../finance/accountsMockData'
import { TODAY_ISO } from '../calendar/dateUtils'
import { getSubgoals } from './goalsSelectors'
import { initialGoals } from './goalsMockData'

// Criar/editar objetivo é página cheia, não bottom sheet (ver
// docs/product/interaction-patterns.md). Só os campos de verdade ficam
// aqui — título, categoria, prazo, visibilidade, custo estimado; progresso,
// alocações, submetas, transações vinculadas e concluir/excluir são
// estado/ação, não formulário, e ficam em GoalDetailScreen (visualização).
// Abrir um objetivo existente vai pra lá; esta tela só existe pelo botão
// "Editar" de lá, e ao salvar volta pra lá.
export function GoalFormScreen() {
  const { goalId } = useParams<{ goalId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const mode: 'create' | 'edit' = goalId ? 'edit' : 'create'
  const editingGoal = goalId ? initialGoals.find((g) => g.id === goalId) : undefined
  const parentGoalId = mode === 'create' ? (searchParams.get('submeta') ?? undefined) : editingGoal?.parentGoalId
  const parentGoal = parentGoalId ? initialGoals.find((g) => g.id === parentGoalId) : undefined
  const isSubgoal = !!parentGoalId
  const backTo =
    mode === 'edit' && goalId
      ? `/home/objetivos/${goalId}`
      : isSubgoal && parentGoalId
        ? `/home/objetivos/${parentGoalId}`
        : '/home/objetivos'

  const hasSubgoals = mode === 'edit' && goalId ? getSubgoals(goalId, initialGoals).length > 0 : false

  const [title, setTitle] = useState(editingGoal?.title ?? '')
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: editingGoal?.context === 'group' ? 'group' : parentGoal?.context === 'group' ? 'group' : 'personal',
    groupId: editingGoal?.groupId ?? parentGoal?.groupId,
  })
  const [deadline, setDeadline] = useState(editingGoal?.deadline ?? '')
  const [category, setCategory] = useState(editingGoal?.category ?? '')
  const [custoEstimado, setCustoEstimado] = useState(editingGoal?.custoEstimado ? editingGoal.custoEstimado.toString().replace('.', ',') : '')

  if (mode === 'edit' && !editingGoal) {
    return <Navigate to="/home/objetivos" replace />
  }

  function handleAddCategory(newCategory: string) {
    setCategories((prev) => (prev.includes(newCategory) ? prev : [...prev, newCategory]))
    if (!initialCategories.includes(newCategory)) initialCategories.push(newCategory)
  }

  function handleSave() {
    if (!title.trim()) return
    const shared = {
      title: title.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      deadline: deadline || undefined,
      category: category.trim() || undefined,
      custoEstimado: custoEstimado.trim() ? parseAmount(custoEstimado) : undefined,
    }

    const target = goalId ? initialGoals.find((g) => g.id === goalId) : undefined
    if (target) {
      Object.assign(target, shared)
    } else {
      const newGoal = { id: `gl-${Date.now()}`, done: false, progress: 0, createdAt: TODAY_ISO, parentGoalId, ...shared }
      initialGoals.push(newGoal)
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
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <PrimaryButton disabled={title.trim().length === 0} onClick={handleSave}>
          {mode === 'create' ? (isSubgoal ? 'Criar submeta' : 'Criar objetivo') : 'Salvar alterações'}
        </PrimaryButton>
      </div>
    </div>
  )
}
