import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { MemberPicker } from '../components/MemberPicker'
import { TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import { TODAY_ISO } from '../calendar/dateUtils'
import { initialTasks } from './tasksMockData'

// Criar/editar tarefa é página cheia, não bottom sheet (ver
// docs/product/interaction-patterns.md) — é um formulário com múltiplos
// campos e passa por um destino próprio (rota), não uma ação efêmera.
//
// Sem store compartilhado entre telas (ver CLAUDE.md): igual a
// CreateGroupScreen, o save muta initialTasks diretamente (módulo, não
// state de componente) pra TasksScreen enxergar a mudança ao remontar.
export function TaskFormScreen() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const mode: 'create' | 'edit' = taskId ? 'edit' : 'create'
  const editingTask = mode === 'edit' ? initialTasks.find((t) => t.id === taskId) : undefined

  const [title, setTitle] = useState(editingTask?.title ?? '')
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: editingTask?.context === 'group' ? 'group' : 'personal',
    groupId: editingTask?.groupId,
  })
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? '')
  const [assigneeIds, setAssigneeIds] = useState<string[]>(editingTask?.assigneeIds ?? [])
  const [about, setAbout] = useState(editingTask?.about ?? '')

  if (mode === 'edit' && !editingTask) {
    return <Navigate to="/home/tarefas" replace />
  }

  function handleSave() {
    if (!title.trim()) return
    const shared = {
      title: title.trim(),
      context: visibility.context,
      groupId: visibility.groupId,
      dueDate: dueDate || undefined,
      assigneeIds: visibility.context === 'group' && assigneeIds.length ? assigneeIds : undefined,
      about: visibility.context === 'personal' && about.trim() ? about.trim() : undefined,
    }
    const target = taskId ? initialTasks.find((t) => t.id === taskId) : undefined
    if (target) {
      Object.assign(target, shared)
    } else {
      initialTasks.unshift({ id: `tk-${Date.now()}`, done: false, ...shared })
    }
    navigate('/home/tarefas')
  }

  function handleDelete() {
    const target = initialTasks.find((t) => t.id === taskId)
    if (!target) return
    target.deletedAt = TODAY_ISO
    navigate('/home/tarefas')
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader title={mode === 'create' ? 'Nova tarefa' : 'Editar tarefa'} to="/home/tarefas" />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="flex flex-col gap-4">
          <TextField
            label="Título"
            placeholder="O que precisa ser feito?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <VisibilityPicker value={visibility} onChange={setVisibility} />

          {visibility.context === 'group' && visibility.groupId ? (
            <MemberPicker
              groupId={visibility.groupId}
              label="Responsável (opcional)"
              selectedIds={assigneeIds}
              onChange={setAssigneeIds}
              hint="Quem tem que fazer isso? Pode escolher mais de uma pessoa, ou nenhuma."
            />
          ) : null}

          {visibility.context === 'personal' ? (
            <TextField
              label="Sobre quem ou o que é isso? (opcional)"
              placeholder="Ex.: Minha mãe"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              hint="Só uma lembrança visual pra você — não compartilha nada com ninguém."
            />
          ) : null}

          <TextField label="Prazo (opcional)" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <PrimaryButton disabled={title.trim().length === 0} onClick={handleSave}>
          {mode === 'create' ? 'Adicionar tarefa' : 'Salvar alterações'}
        </PrimaryButton>
        {mode === 'edit' ? (
          <GhostButton onClick={handleDelete} className="flex items-center justify-center gap-1.5 text-danger">
            <Trash2 size={16} strokeWidth={2.2} />
            Excluir tarefa
          </GhostButton>
        ) : null}
      </div>
    </div>
  )
}
