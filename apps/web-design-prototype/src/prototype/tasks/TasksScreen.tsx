import { CheckSquare2, Plus, Repeat, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { DomainLabel } from '../components/DomainLabel'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { TrashSheet } from '../components/TrashSheet'
import { VisibilityDot } from '../components/VisibilityDot'
import { formatRelativeDayLabel } from '../calendar/dateUtils'
import { resolveMemberNames } from '../groups/groupsMockData'
import { mockGroups } from '../home/homeMockData'
import { initialTasks, type MockTask } from './tasksMockData'

function TaskRow({ task, onToggle, onEdit }: { task: MockTask; onToggle: () => void; onEdit: () => void }) {
  const assigneeNames = resolveMemberNames(task.groupId, task.assigneeIds)
  return (
    <div className="flex w-full items-start gap-3 py-3 text-left">
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill border-2 transition active:scale-90 ${
          task.done ? 'border-accent bg-accent' : 'border-line'
        }`}
      >
        {task.done ? <CheckSquare2 size={13} strokeWidth={3} className="text-white" /> : null}
      </button>
      <button type="button" onClick={onEdit} className="flex flex-1 items-start justify-between gap-2 text-left">
        <span>
          <span className="flex items-center gap-1.5">
            <span className={`text-[15px] font-semibold ${task.done ? 'text-ink-faint line-through' : 'text-ink'}`}>
              {task.title}
            </span>
            {assigneeNames.map((name) => (
              <Avatar key={name} name={name} />
            ))}
          </span>
          {!task.done && (task.dueDate || task.recurring || task.about) ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {task.dueDate ? (
                <span className="rounded-sm bg-sky-bg px-1.5 py-0.5 text-[11px] font-bold text-sky-fg">
                  {formatRelativeDayLabel(task.dueDate)}
                </span>
              ) : null}
              {task.recurring ? <FlagChip icon={Repeat}>Recorrente</FlagChip> : null}
              {task.about ? <FlagChip>{task.about}</FlagChip> : null}
            </div>
          ) : null}
        </span>
        <VisibilityDot context={task.context} groupId={task.groupId} className="mt-1.5" />
      </button>
    </div>
  )
}

export function TasksScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [tasks, setTasks] = useState(initialTasks)
  const [showTrash, setShowTrash] = useState(false)

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  function handleRestore(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, deletedAt: undefined } : task)))
  }

  function handleDeleteForever(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const active = tasks.filter((t) => !t.deletedAt)
  const trashed = tasks.filter((t) => t.deletedAt)
  const visible = active.filter((t) => matchesContext(filter, t))
  const pending = visible.filter((t) => !t.done)
  const completed = visible.filter((t) => t.done)

  return (
    <HomeLayout>
      <div className="px-6 pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight text-ink">Tarefas</h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {pending.length === 0 ? 'Tudo em dia por aqui' : `${pending.length} pendente${pending.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTrash(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-pill text-ink-muted transition active:scale-90"
              aria-label="Lixeira de tarefas"
            >
              <Trash2 size={19} strokeWidth={2.2} />
              {trashed.length > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-pill bg-danger" />
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => navigate('/home/tarefas/nova')}
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
              aria-label="Nova tarefa"
            >
              <Plus size={20} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Tile span={2}>
            <DomainLabel icon={<CheckSquare2 size={15} strokeWidth={2.4} />} tone="mint">
              Pendentes
            </DomainLabel>
            {pending.length === 0 ? (
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra criar uma tarefa.</p>
            ) : (
              <div className="flex flex-col divide-y divide-line">
                {pending.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onEdit={() => navigate(`/home/tarefas/${task.id}/editar`)}
                  />
                ))}
              </div>
            )}
          </Tile>

          {completed.length > 0 ? (
            <Tile span={2}>
              <DomainLabel icon={<CheckSquare2 size={13} strokeWidth={2.4} />} tone="sky" size="sm">
                Concluídas
              </DomainLabel>
              <div className="flex flex-col divide-y divide-line">
                {completed.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onEdit={() => navigate(`/home/tarefas/${task.id}/editar`)}
                  />
                ))}
              </div>
            </Tile>
          ) : null}
        </div>
      </div>

      {showTrash ? (
        <TrashSheet
          title="Lixeira · Tarefas"
          items={trashed}
          getId={(t) => t.id}
          getDeletedAt={(t) => t.deletedAt!}
          renderItem={(task) => (
            <div>
              <span className="flex items-center gap-1.5">
                <span className="text-[15px] font-semibold text-ink">{task.title}</span>
                {resolveMemberNames(task.groupId, task.assigneeIds).map((name) => (
                  <Avatar key={name} name={name} />
                ))}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-faint">
                <VisibilityDot context={task.context} groupId={task.groupId} />
                {task.context === 'group'
                  ? mockGroups.find((g) => g.id === task.groupId)?.name
                  : task.context === 'shared'
                    ? 'Compartilhado'
                    : 'Pessoal'}
              </span>
            </div>
          )}
          onRestore={handleRestore}
          onDeleteForever={handleDeleteForever}
          onClose={() => setShowTrash(false)}
        />
      ) : null}
    </HomeLayout>
  )
}
