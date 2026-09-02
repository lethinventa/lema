import { CalendarDays, Grid3x3, List, Plus } from 'lucide-react'
import { useState } from 'react'
import { ContextFilterChips, type ContextFilterValue, matchesContext } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { initialTasks, type MockTask } from '../tasks/tasksMockData'
import { CalendarAgendaView } from './CalendarAgendaView'
import { CalendarMonthView } from './CalendarMonthView'
import { CalendarWeekView } from './CalendarWeekView'
import { EventSheet, type EventSheetValues } from './EventSheet'
import { initialEvents, type MockEvent } from './calendarMockData'
import {
  applyOccurrenceDelete,
  applyOccurrenceEdit,
  applySeriesDelete,
  applySeriesEdit,
  type EventEditInput,
  type EventOccurrence,
} from './calendarSelectors'
import { TODAY_ISO } from './dateUtils'

type ViewMode = 'agenda' | 'week' | 'month'

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: typeof List }[] = [
  { value: 'agenda', label: 'Agenda', icon: List },
  { value: 'week', label: 'Semana', icon: CalendarDays },
  { value: 'month', label: 'Mês', icon: Grid3x3 },
]

function toEditInput(values: EventSheetValues): EventEditInput {
  return {
    title: values.title,
    context: values.context,
    groupId: values.groupId,
    date: values.date,
    time: values.time,
    endTime: values.endTime || undefined,
    location: values.location || undefined,
    participants: values.participants.length ? values.participants : undefined,
    participantIds: values.participantIds.length ? values.participantIds : undefined,
    recurrence: values.recurrenceFreq ? { freq: values.recurrenceFreq, endDate: values.recurrenceEndDate || undefined } : undefined,
  }
}

type SheetState = { mode: 'create'; defaultDate: string } | { mode: 'edit'; occurrence: EventOccurrence } | null

export function CalendarScreen() {
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [view, setView] = useState<ViewMode>('agenda')
  const [anchorDate, setAnchorDate] = useState(TODAY_ISO)
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO)
  const [events, setEvents] = useState<MockEvent[]>(initialEvents)
  const [tasks, setTasks] = useState<MockTask[]>(initialTasks)
  const [sheet, setSheet] = useState<SheetState>(null)

  const visibleEvents = events.filter((e) => matchesContext(filter, e))
  const visibleTasks = tasks.filter((t) => matchesContext(filter, t) && t.dueDate)

  function handleCreate(values: EventSheetValues) {
    setEvents((prev) => [...prev, { id: `ev-${Date.now()}`, ...toEditInput(values) }])
    setSheet(null)
  }

  function handleEditSave(values: EventSheetValues) {
    if (sheet?.mode !== 'edit') return
    const { occurrence } = sheet
    const rootId = occurrence.event.seriesId ?? occurrence.event.id
    const input = toEditInput(values)

    if (occurrence.isRecurring) {
      setEvents((prev) =>
        values.scope === 'series' ? applySeriesEdit(prev, rootId, input) : applyOccurrenceEdit(prev, rootId, occurrence.date, input),
      )
    } else {
      setEvents((prev) => prev.map((e) => (e.id === occurrence.event.id ? { id: e.id, ...input } : e)))
    }
    setSheet(null)
  }

  function handleDelete(scope: 'occurrence' | 'series') {
    if (sheet?.mode !== 'edit') return
    const { occurrence } = sheet
    const rootId = occurrence.event.seriesId ?? occurrence.event.id

    if (occurrence.isRecurring) {
      setEvents((prev) => (scope === 'series' ? applySeriesDelete(prev, rootId) : applyOccurrenceDelete(prev, rootId, occurrence.date)))
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== occurrence.event.id))
    }
    setSheet(null)
  }

  function handleToggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
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
          <button
            type="button"
            onClick={() => setSheet({ mode: 'create', defaultDate: defaultCreateDate })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
            aria-label="Novo compromisso"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
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
                view === opt.value ? 'border-accent bg-accent text-white' : 'border-line bg-surface text-ink-muted'
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
              onSelectOccurrence={(occ) => setSheet({ mode: 'edit', occurrence: occ })}
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
                onSelectOccurrence={(occ) => setSheet({ mode: 'edit', occurrence: occ })}
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
                onSelectOccurrence={(occ) => setSheet({ mode: 'edit', occurrence: occ })}
                onToggleTask={handleToggleTask}
              />
            </Tile>
          ) : null}
        </div>
      </div>

      {sheet?.mode === 'create' ? (
        <EventSheet
          mode="create"
          initial={{
            title: '',
            context: 'personal',
            groupId: undefined,
            date: sheet.defaultDate,
            time: '',
            endTime: '',
            location: '',
            participants: [],
            participantIds: [],
            recurrenceFreq: '',
            recurrenceEndDate: '',
            scope: 'occurrence',
          }}
          onSave={handleCreate}
          onClose={() => setSheet(null)}
        />
      ) : null}

      {sheet?.mode === 'edit' ? (
        <EventSheet
          key={sheet.occurrence.occurrenceKey}
          mode="edit"
          isRecurringOccurrence={sheet.occurrence.isRecurring}
          initial={{
            title: sheet.occurrence.event.title,
            context: sheet.occurrence.event.context === 'group' ? 'group' : 'personal',
            groupId: sheet.occurrence.event.groupId,
            date: sheet.occurrence.date,
            time: sheet.occurrence.event.time,
            endTime: sheet.occurrence.event.endTime ?? '',
            location: sheet.occurrence.event.location ?? '',
            participants: sheet.occurrence.event.participants ?? [],
            participantIds: sheet.occurrence.event.participantIds ?? [],
            recurrenceFreq: sheet.occurrence.event.recurrence?.freq ?? '',
            recurrenceEndDate: sheet.occurrence.event.recurrence?.endDate ?? '',
            scope: 'occurrence',
          }}
          onSave={handleEditSave}
          onDelete={handleDelete}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </HomeLayout>
  )
}
