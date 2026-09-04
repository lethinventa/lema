import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { MockTask } from '../tasks/tasksMockData'
import type { MockEvent } from './calendarMockData'
import type { EventOccurrence } from './calendarSelectors'
import { expandOccurrences, getTasksForDate } from './calendarSelectors'
import {
  addDays,
  formatMonthYearLabel,
  formatWeekdayShort,
  getWeekDays,
  getWeekStart,
  minutesToTime,
  TODAY_ISO,
  timeToMinutes,
} from './dateUtils'

const HOUR_HEIGHT = 52
const GRID_HEIGHT = HOUR_HEIGHT * 24

function eventColor(context: MockEvent['context']) {
  // Reaproveita o significado já estabelecido pelo VisibilityDot: GROUP usa
  // accent (cor do grupo), PERSONAL/SHARED usam sky — não é uma paleta nova.
  return context === 'group'
    ? { bg: 'bg-accent', text: 'text-ink' }
    : { bg: 'bg-sky-bg', text: 'text-sky-fg' }
}

interface CalendarWeekViewProps {
  events: MockEvent[]
  tasks: MockTask[]
  anchorDate: string
  onNavigate: (nextAnchor: string) => void
  onSelectOccurrence: (occurrence: EventOccurrence) => void
  onToggleTask: (taskId: string) => void
}

export function CalendarWeekView({ events, tasks, anchorDate, onNavigate, onSelectOccurrence, onToggleTask }: CalendarWeekViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const days = getWeekDays(anchorDate)
  const weekStart = getWeekStart(anchorDate)
  const occurrences = expandOccurrences(events, days[0], days[6])

  useEffect(() => {
    if (!scrollRef.current) return
    const earliest = occurrences.reduce((min, occ) => Math.min(min, timeToMinutes(occ.event.time)), 8 * 60)
    scrollRef.current.scrollTop = Math.max(0, (earliest - 60) / 60) * HOUR_HEIGHT
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorDate])

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[14px] font-bold text-ink">{formatMonthYearLabel(anchorDate)}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavigate(addDays(weekStart, -7))}
            aria-label="Semana anterior"
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
            onClick={() => onNavigate(addDays(weekStart, 7))}
            aria-label="Próxima semana"
            className="flex h-7 w-7 items-center justify-center rounded-pill text-ink-muted active:scale-90"
          >
            <ChevronRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="w-8 shrink-0" />
        {days.map((iso) => {
          const isToday = iso === TODAY_ISO
          return (
            <div key={iso} className="flex flex-1 flex-col items-center gap-0.5 pb-1.5">
              <span className="text-[10px] font-bold uppercase text-ink-faint">{formatWeekdayShort(iso)}</span>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-pill text-[12px] font-bold tabular ${
                  isToday ? 'bg-accent text-ink' : 'text-ink'
                }`}
              >
                {Number(iso.slice(8, 10))}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex border-t border-line">
        <div className="w-8 shrink-0" />
        {days.map((iso) => {
          const dayTasks = getTasksForDate(tasks, iso)
          return (
            <div key={iso} className="flex flex-1 flex-col gap-0.5 border-l border-line px-0.5 py-1">
              {dayTasks.slice(0, 2).map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`truncate rounded-sm px-1 py-0.5 text-left text-[9px] font-bold ${
                    task.done ? 'bg-surface-muted text-ink-faint line-through' : 'bg-mint-bg text-mint-fg'
                  }`}
                  title={task.title}
                >
                  {task.title}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      <div ref={scrollRef} className="relative max-h-[420px] overflow-y-auto">
        <div className="flex" style={{ height: GRID_HEIGHT }}>
          <div className="relative w-8 shrink-0">
            {Array.from({ length: 24 }, (_, h) => (
              <span
                key={h}
                className="absolute -translate-y-1/2 pr-1 text-right text-[9px] font-semibold text-ink-faint"
                style={{ top: h * HOUR_HEIGHT, right: 0 }}
              >
                {h > 0 ? `${h}h` : ''}
              </span>
            ))}
          </div>

          {days.map((iso) => {
            const dayOccurrences = occurrences.filter((o) => o.date === iso)
            const isToday = iso === TODAY_ISO
            return (
              <div key={iso} className="relative flex-1 border-l border-line">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="absolute left-0 right-0 border-t border-line" style={{ top: h * HOUR_HEIGHT }} />
                ))}

                {isToday ? (
                  <div
                    className="absolute left-0 right-0 z-10 h-[2px] bg-danger"
                    style={{ top: (timeToMinutes(nowLabel()) / 60) * HOUR_HEIGHT }}
                  />
                ) : null}

                {dayOccurrences.map((occ) => {
                  const start = timeToMinutes(occ.event.time)
                  const end = occ.event.endTime ? timeToMinutes(occ.event.endTime) : start + 60
                  const top = (start / 60) * HOUR_HEIGHT
                  const height = Math.max(20, ((end - start) / 60) * HOUR_HEIGHT - 2)
                  const color = eventColor(occ.event.context)
                  return (
                    <button
                      key={occ.occurrenceKey}
                      type="button"
                      onClick={() => onSelectOccurrence(occ)}
                      className={`absolute left-0.5 right-0.5 overflow-hidden rounded-sm px-1 py-0.5 text-left text-[9px] font-bold leading-tight ${color.bg} ${color.text}`}
                      style={{ top, height }}
                      title={`${occ.event.title} · ${occ.event.time}`}
                    >
                      {occ.event.title}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function nowLabel() {
  return minutesToTime(new Date().getHours() * 60 + new Date().getMinutes())
}
