import { CalendarDays } from 'lucide-react'
import { Tile } from '../components/Tile'
import type { MockTask } from '../tasks/tasksMockData'
import { EventOccurrenceRow, TaskAgendaRow } from './CalendarRows'
import type { MockEvent } from './calendarMockData'
import { expandOccurrences, getTasksForDate, type EventOccurrence } from './calendarSelectors'
import { addDays, formatRelativeDayLabel, TODAY_ISO } from './dateUtils'

const AGENDA_WINDOW_DAYS = 30

interface CalendarAgendaViewProps {
  events: MockEvent[]
  tasks: MockTask[]
  onSelectOccurrence: (occurrence: EventOccurrence) => void
  onToggleTask: (taskId: string) => void
}

export function CalendarAgendaView({ events, tasks, onSelectOccurrence, onToggleTask }: CalendarAgendaViewProps) {
  const rangeEnd = addDays(TODAY_ISO, AGENDA_WINDOW_DAYS)
  const occurrences = expandOccurrences(events, TODAY_ISO, rangeEnd)

  const days = Array.from(new Set([...occurrences.map((o) => o.date), ...tasks.filter((t) => t.dueDate).map((t) => t.dueDate!)]))
    .filter((iso) => iso >= TODAY_ISO && iso <= rangeEnd)
    .sort()

  if (days.length === 0) {
    return (
      <Tile span={2}>
        <span className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-sky-bg text-sky-fg">
            <CalendarDays size={15} strokeWidth={2.4} />
          </span>
          <span className="text-[15px] font-bold text-ink">Agenda</span>
        </span>
        <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra criar um compromisso.</p>
      </Tile>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {days.map((day) => (
        <Tile key={day} span={2}>
          <span className="mb-1 inline-block rounded-sm bg-sky-bg px-2 py-1 text-[12px] font-bold uppercase tracking-wide text-sky-fg">
            {formatRelativeDayLabel(day)}
          </span>
          <div className="flex flex-col divide-y divide-line">
            {getTasksForDate(tasks, day).map((task) => (
              <TaskAgendaRow key={task.id} task={task} onToggle={() => onToggleTask(task.id)} />
            ))}
            {occurrences
              .filter((o) => o.date === day)
              .map((occ) => (
                <EventOccurrenceRow key={occ.occurrenceKey} occurrence={occ} onEdit={() => onSelectOccurrence(occ)} />
              ))}
          </div>
        </Tile>
      ))}
    </div>
  )
}
