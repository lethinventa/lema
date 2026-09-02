import { CheckSquare2, Plus, Repeat } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { DomainLabel } from '../components/DomainLabel'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { VisibilityDot } from '../components/VisibilityDot'
import { formatRelativeDayLabel } from '../calendar/dateUtils'
import { resolveMemberNames } from '../groups/groupsMockData'
import { initialTasks, type MockTask } from './tasksMockData'
import { TaskSheet, type TaskSheetValues } from './TaskSheet'

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
          {!task.done && (task.dueDate || task.recurring) ? (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {task.dueDate ? (
                <span className="rounded-sm bg-sky-bg px-1.5 py-0.5 text-[11px] font-bold text-sky-fg">
                  {formatRelativeDayLabel(task.dueDate)}
                </span>
              ) : null}
              {task.recurring ? <FlagChip icon={Repeat}>Recorrente</FlagChip> : null}
            </div>
          ) : null}
        </span>
        <VisibilityDot context={task.context} groupId={task.groupId} className="mt-1.5" />
      </button>
    </div>
  )
}

export function TasksScreen() {
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [tasks, setTasks] = useState(initialTasks)
  const [sheet, setSheet] = useState<{ mode: 'create' } | { mode: 'edit'; taskId: string } | null>(null)

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  function handleCreate(values: TaskSheetValues) {
    setTasks((prev) => [
      {
        id: `tk-${Date.now()}`,
        title: values.title,
        context: values.context,
        groupId: values.groupId,
        done: false,
        dueDate: values.dueDate || undefined,
        assigneeIds: values.assigneeIds.length ? values.assigneeIds : undefined,
      },
      ...prev,
    ])
    setSheet(null)
  }

  function handleEditSave(values: TaskSheetValues) {
    if (sheet?.mode !== 'edit') return
    setTasks((prev) =>
      prev.map((task) =>
        task.id === sheet.taskId
          ? {
              ...task,
              title: values.title,
              context: values.context,
              groupId: values.groupId,
              dueDate: values.dueDate || undefined,
              assigneeIds: values.assigneeIds.length ? values.assigneeIds : undefined,
            }
          : task,
      ),
    )
    setSheet(null)
  }

  function handleDelete() {
    if (sheet?.mode !== 'edit') return
    setTasks((prev) => prev.filter((task) => task.id !== sheet.taskId))
    setSheet(null)
  }

  const visible = tasks.filter((t) => matchesContext(filter, t))
  const pending = visible.filter((t) => !t.done)
  const completed = visible.filter((t) => t.done)
  const editingTask = sheet?.mode === 'edit' ? tasks.find((t) => t.id === sheet.taskId) : undefined

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
          <button
            type="button"
            onClick={() => setSheet({ mode: 'create' })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
            aria-label="Nova tarefa"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
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
                    onEdit={() => setSheet({ mode: 'edit', taskId: task.id })}
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
                    onEdit={() => setSheet({ mode: 'edit', taskId: task.id })}
                  />
                ))}
              </div>
            </Tile>
          ) : null}
        </div>
      </div>

      {sheet?.mode === 'create' ? (
        <TaskSheet mode="create" onSave={handleCreate} onClose={() => setSheet(null)} />
      ) : null}

      {sheet?.mode === 'edit' && editingTask ? (
        <TaskSheet
          mode="edit"
          initial={{
            title: editingTask.title,
            context: editingTask.context === 'group' ? 'group' : 'personal',
            groupId: editingTask.groupId,
            dueDate: editingTask.dueDate ?? '',
            assigneeIds: editingTask.assigneeIds ?? [],
          }}
          onSave={handleEditSave}
          onDelete={handleDelete}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </HomeLayout>
  )
}
