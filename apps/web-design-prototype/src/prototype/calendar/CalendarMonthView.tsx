import { ChevronLeft, ChevronRight } from 'lucide-react'
import { EventOccurrenceRow, TaskAgendaRow } from './CalendarRows'
import type { MockEvent } from './calendarMockData'
import { expandOccurrences, getTasksForDate, type EventOccurrence } from './calendarSelectors'
import { addMonths, formatMonthYearLabel, getMonthGridDays, TODAY_ISO } from './dateUtils'
import type { MockTask } from '../tasks/tasksMockData'

const WEEKDAY_HEADERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface CalendarMonthViewProps {
  events: MockEvent[]
  tasks: MockTask[]
  anchorMonth: string
  selectedDate: string
  onNavigate: (nextAnchor: string) => void
  onSelectDate: (iso: string) => void
  onSelectOccurrence: (occurrence: EventOccurrence) => void
  onToggleTask: (taskId: string) => void
}

export function CalendarMonthView({
  events,
  tasks,
  anchorMonth,
  selectedDate,
  onNavigate,
  onSelectDate,
  onSelectOccurrence,
  onToggleTask,
}: CalendarMonthViewProps) {
  const gridDays = getMonthGridDays(anchorMonth)
  const monthOccurrences = expandOccurrences(events, gridDays[0].iso, gridDays[41].iso)
  const selectedOccurrences = monthOccurrences.filter((o) => o.date === selectedDate)
  const selectedTasks = getTasksForDate(tasks, selectedDate)

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[14px] font-bold capitalize text-ink">{formatMonthYearLabel(anchorMonth)}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavigate(addMonths(anchorMonth, -1))}
            aria-label="Mês anterior"
            className="flex h-7 w-7 items-center justify-center rounded-pill text-ink-muted active:scale-90"
          >
            <ChevronLeft size={16} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(TODAY_ISO)}
            className="rounded-sm px-2 py-1 text-[11px] font-bold text-ink-muted"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => onNavigate(addMonths(anchorMonth, 1))}
            aria-label="Próximo mês"
            className="flex h-7 w-7 items-center justify-center rounded-pill text-ink-muted active:scale-90"
          >
            <ChevronRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAY_HEADERS.map((label, i) => (
          <span key={i} className="text-center text-[10px] font-bold uppercase text-ink-faint">
            {label}
          </span>
        ))}

        {gridDays.map(({ iso, inMonth }) => {
          const hasEvents = monthOccurrences.some((o) => o.date === iso)
          const hasTasks = getTasksForDate(tasks, iso).length > 0
          const isToday = iso === TODAY_ISO
          const isSelected = iso === selectedDate
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className="flex flex-col items-center gap-0.5 py-1"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-pill text-[12px] font-bold tabular ${
                  isSelected
                    ? 'bg-accent text-ink'
                    : isToday
                      ? 'border-2 border-accent text-ink'
                      : inMonth
                        ? 'text-ink'
                        : 'text-ink-faint/50'
                }`}
              >
                {Number(iso.slice(8, 10))}
              </span>
              <span className="flex h-1 items-center gap-0.5">
                {hasEvents ? <span className="h-1 w-1 rounded-pill bg-sky-fg" /> : null}
                {hasTasks ? <span className="h-1 w-1 rounded-pill bg-mint-fg" /> : null}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 border-t border-line pt-1">
        {selectedOccurrences.length === 0 && selectedTasks.length === 0 ? (
          <p className="py-3 text-[13px] text-ink-faint">Nada por aqui nesse dia.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {selectedOccurrences.map((occ) => (
              <EventOccurrenceRow key={occ.occurrenceKey} occurrence={occ} onEdit={() => onSelectOccurrence(occ)} />
            ))}
            {selectedTasks.map((task) => (
              <TaskAgendaRow key={task.id} task={task} onToggle={() => onToggleTask(task.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
