import { CheckSquare2, Pencil, Repeat, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { BackHeader } from '../components/BackHeader'
import { GhostButton } from '../components/Buttons'
import { FlagChip } from '../components/FlagChip'
import { formatRelativeDayLabel, TODAY_ISO } from '../calendar/dateUtils'
import { resolveMemberNames } from '../groups/groupsMockData'
import { initialTasks } from './tasksMockData'

// Visualização é a tela padrão ao abrir uma tarefa existente — edição é uma
// ação explícita a partir daqui (ver docs/product/interaction-patterns.md).
// Marcar concluída é uma ação pontual sobre estado, não um campo de
// formulário, então fica aqui, fora do TaskFormScreen.
export function TaskDetailScreen() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const task = initialTasks.find((t) => t.id === taskId)
  const [done, setDone] = useState(task?.done ?? false)

  if (!task) {
    return <Navigate to="/home/tarefas" replace />
  }

  const assigneeNames = resolveMemberNames(task.groupId, task.assigneeIds)

  function toggleDone() {
    const target = initialTasks.find((t) => t.id === taskId)
    if (!target) return
    target.done = !done
    setDone(target.done)
  }

  function handleDelete() {
    const target = initialTasks.find((t) => t.id === taskId)
    if (!target) return
    target.deletedAt = TODAY_ISO
    navigate('/home/tarefas')
  }

  return (
    <div className="relative flex h-full flex-col">
      <BackHeader
        title={task.title}
        to="/home/tarefas"
        action={
          <button
            type="button"
            onClick={() => navigate(`/home/tarefas/${task.id}/editar`)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-surface-muted text-ink transition active:scale-90"
            aria-label="Editar tarefa"
          >
            <Pencil size={17} strokeWidth={2.2} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={toggleDone}
            className="flex w-full items-center gap-3 rounded-md border border-line p-3 text-left transition active:scale-[0.99]"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border-2 ${
                done ? 'border-accent bg-accent' : 'border-line'
              }`}
            >
              {done ? <CheckSquare2 size={13} strokeWidth={3} className="text-ink" /> : null}
            </span>
            <span className={`flex-1 text-[14px] font-semibold ${done ? 'text-ink-faint line-through' : 'text-ink'}`}>
              {done ? 'Concluída' : 'Marcar como concluída'}
            </span>
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            <FlagChip>
              {task.context === 'group' ? 'Grupo' : task.context === 'shared' ? 'Compartilhado' : 'Pessoal'}
            </FlagChip>
            {task.dueDate ? <FlagChip>{formatRelativeDayLabel(task.dueDate)}</FlagChip> : null}
            {task.recurring ? <FlagChip icon={Repeat}>Recorrente</FlagChip> : null}
          </div>

          {assigneeNames.length > 0 ? (
            <div>
              <span className="mb-1.5 block text-[12px] font-semibold text-ink-muted">Responsáveis</span>
              <div className="flex flex-wrap items-center gap-2">
                {assigneeNames.map((name) => (
                  <span key={name} className="flex items-center gap-1.5 rounded-pill bg-surface-muted py-1 pl-1 pr-2.5">
                    <Avatar name={name} />
                    <span className="text-[13px] font-semibold text-ink">{name}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {task.about ? (
            <div>
              <span className="mb-1 block text-[12px] font-semibold text-ink-muted">Sobre</span>
              <p className="text-[14px] text-ink">{task.about}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line px-6 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <GhostButton onClick={handleDelete} className="flex items-center justify-center gap-1.5 text-danger">
          <Trash2 size={16} strokeWidth={2.2} />
          Excluir tarefa
        </GhostButton>
      </div>
    </div>
  )
}
