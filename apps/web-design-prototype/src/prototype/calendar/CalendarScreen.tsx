import { CalendarDays, Grid3x3, List, Plus, Repeat, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { FlagChip } from '../components/FlagChip'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { TrashSheet } from '../components/TrashSheet'
import { mockGroups } from '../home/homeMockData'
import { initialTasks, type MockTask } from '../tasks/tasksMockData'
import { CalendarAgendaView } from './CalendarAgendaView'
import { CalendarMonthView } from './CalendarMonthView'
import { CalendarWeekView } from './CalendarWeekView'
import { initialEvents, type MockEvent } from './calendarMockData'
import type { EventOccurrence } from './calendarSelectors'
import { formatRelativeDayLabel, TODAY_ISO } from './dateUtils'

type ViewMode = 'agenda' | 'week' | 'month'

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: typeof List }[] = [
  { value: 'agenda', label: 'Agenda', icon: List },
  { value: 'week', label: 'Semana', icon: CalendarDays },
  { value: 'month', label: 'Mês', icon: Grid3x3 },
]

// Visualização (e edição, a partir dela) precisa da raiz da série + data pra
// reconstruir a ocorrência (ver EventDetailScreen) — ambos já existem em
// toda EventOccurrence.
function detailPath(occ: EventOccurrence) {
  const rootId = occ.event.seriesId ?? occ.event.id
  return `/home/calendario/${rootId}?data=${occ.date}`
}

export function CalendarScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [view, setView] = useState<ViewMode>('agenda')
  const [anchorDate, setAnchorDate] = useState(TODAY_ISO)
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO)
  const [events, setEvents] = useState<MockEvent[]>(initialEvents)
  const [tasks, setTasks] = useState<MockTask[]>(initialTasks)
  const [showTrash, setShowTrash] = useState(false)

  const activeEvents = events.filter((e) => !e.deletedAt)
  const trashedEvents = events.filter((e) => e.deletedAt)
  const visibleEvents = activeEvents.filter((e) => matchesContext(filter, e))
  const visibleTasks = tasks.filter((t) => matchesContext(filter, t) && t.dueDate)

  function handleToggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function handleRestoreEvent(id: string) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, deletedAt: undefined } : e)))
  }

  function handleDeleteEventForever(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id && e.seriesId !== id))
  }

  const defaultCreateDate = view === 'month' ? selectedDate : view === 'week' ? anchorDate : TODAY_ISO

  return (
    <HomeLayout>
      <div className="px-6 pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight text-ink">Calendário</h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {visibleEvents.length === 0 ? 'Nada na agenda' : `${visibleEvents.length} compromisso${visibleEvents.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTrash(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-pill text-ink-muted transition active:scale-90"
              aria-label="Lixeira de compromissos"
            >
              <Trash2 size={19} strokeWidth={2.2} />
              {trashedEvents.length > 0 ? (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-pill bg-danger" />
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/home/calendario/novo?data=${defaultCreateDate}`)}
              className="flex h-10 w-10 items-center justify-center rounded-pill bg-accent text-ink transition active:scale-90"
              aria-label="Novo compromisso"
            >
              <Plus size={20} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-3 flex gap-2">
          {VIEW_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setView(opt.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm border px-3 py-2 text-[12.5px] font-semibold transition active:scale-95 ${
                view === opt.value ? 'border-accent bg-accent text-ink' : 'border-line bg-surface text-ink-muted'
              }`}
            >
              <opt.icon size={13} strokeWidth={2.4} />
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {view === 'agenda' ? (
            <CalendarAgendaView
              events={visibleEvents}
              tasks={visibleTasks}
              onSelectOccurrence={(occ) => navigate(detailPath(occ))}
              onToggleTask={handleToggleTask}
            />
          ) : null}

          {view === 'week' ? (
            <Tile span={2}>
              <CalendarWeekView
                events={visibleEvents}
                tasks={visibleTasks}
                anchorDate={anchorDate}
                onNavigate={setAnchorDate}
                onSelectOccurrence={(occ) => navigate(detailPath(occ))}
                onToggleTask={handleToggleTask}
              />
            </Tile>
          ) : null}

          {view === 'month' ? (
            <Tile span={2}>
              <CalendarMonthView
                events={visibleEvents}
                tasks={visibleTasks}
                anchorMonth={anchorDate}
                selectedDate={selectedDate}
                onNavigate={(next) => {
                  setAnchorDate(next)
                  setSelectedDate(next)
                }}
                onSelectDate={setSelectedDate}
                onSelectOccurrence={(occ) => navigate(detailPath(occ))}
                onToggleTask={handleToggleTask}
              />
            </Tile>
          ) : null}
        </div>
      </div>

      {showTrash ? (
        <TrashSheet
          title="Lixeira · Calendário"
          items={trashedEvents}
          getId={(e) => e.id}
          getDeletedAt={(e) => e.deletedAt!}
          renderItem={(event) => (
            <div>
              <span className="flex items-center gap-1.5">
                <span className="text-[15px] font-semibold text-ink">{event.title}</span>
                {event.recurrence ? <FlagChip icon={Repeat}>Série</FlagChip> : null}
              </span>
              <span className="mt-1 block text-[12px] text-ink-faint">
                {formatRelativeDayLabel(event.date)} · {event.time}
                {event.context === 'group' ? ` · ${mockGroups.find((g) => g.id === event.groupId)?.name}` : ''}
              </span>
            </div>
          )}
          onRestore={handleRestoreEvent}
          onDeleteForever={handleDeleteEventForever}
          onClose={() => setShowTrash(false)}
        />
      ) : null}
    </HomeLayout>
  )
}
