import { CalendarDays, MapPin, Plus, Repeat } from 'lucide-react'
import { useState } from 'react'
import { ContextFilterChips, type ContextFilterValue } from '../components/ContextFilterChips'
import { HomeLayout } from '../components/HomeLayout'
import { Tile } from '../components/Tile'
import { type HomeContext, mockGroup } from '../home/homeMockData'
import { EventSheet, type EventSheetValues } from './EventSheet'
import { initialEvents, type MockEvent } from './calendarMockData'

function matches(filter: ContextFilterValue, context: HomeContext) {
  return filter === 'all' || filter === context
}

function EventRow({ event, onEdit }: { event: MockEvent; onEdit: () => void }) {
  return (
    <button type="button" onClick={onEdit} className="flex w-full items-start gap-3 py-3 text-left">
      <span className="mt-0.5 w-12 shrink-0 text-[13px] font-bold tabular-nums text-ink">{event.time}</span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold text-ink">{event.title}</span>
        {event.location || event.participant || event.recurring ? (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {event.location ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-ink-faint">
                <MapPin size={12} strokeWidth={2.4} />
                {event.location}
              </span>
            ) : null}
            {event.participant ? (
              <span className="rounded-sm bg-lavender-bg px-1.5 py-0.5 text-[11px] font-bold text-lavender-fg">
                {event.participant}
              </span>
            ) : null}
            {event.recurring ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-ink-faint">
                <Repeat size={12} strokeWidth={2.4} />
                Recorrente
              </span>
            ) : null}
          </div>
        ) : null}
      </span>
    </button>
  )
}

export function CalendarScreen() {
  const [filter, setFilter] = useState<ContextFilterValue>('all')
  const [events, setEvents] = useState(initialEvents)
  const [sheet, setSheet] = useState<{ mode: 'create' } | { mode: 'edit'; eventId: string } | null>(null)

  function handleCreate(values: EventSheetValues) {
    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}`,
        title: values.title,
        context: values.context,
        dayLabel: values.dayLabel,
        time: values.time,
        location: values.location || undefined,
      },
    ])
    setSheet(null)
  }

  function handleEditSave(values: EventSheetValues) {
    if (sheet?.mode !== 'edit') return
    setEvents((prev) =>
      prev.map((event) =>
        event.id === sheet.eventId
          ? {
              ...event,
              title: values.title,
              context: values.context,
              dayLabel: values.dayLabel,
              time: values.time,
              location: values.location || undefined,
            }
          : event,
      ),
    )
    setSheet(null)
  }

  function handleDelete() {
    if (sheet?.mode !== 'edit') return
    setEvents((prev) => prev.filter((event) => event.id !== sheet.eventId))
    setSheet(null)
  }

  const visible = events.filter((e) => matches(filter, e.context))
  const groups: { dayLabel: string; items: MockEvent[] }[] = []
  for (const event of visible) {
    const group = groups.find((g) => g.dayLabel === event.dayLabel)
    if (group) group.items.push(event)
    else groups.push({ dayLabel: event.dayLabel, items: [event] })
  }
  const editingEvent = sheet?.mode === 'edit' ? events.find((e) => e.id === sheet.eventId) : undefined

  return (
    <HomeLayout>
      <div className="px-6 pb-4 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold leading-tight text-ink">Calendário</h1>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              {visible.length === 0 ? 'Nada na agenda' : `${visible.length} compromisso${visible.length > 1 ? 's' : ''} esta semana`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSheet({ mode: 'create' })}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-white transition active:scale-90"
            aria-label="Novo compromisso"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-5">
          <ContextFilterChips value={filter} onChange={setFilter} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {groups.length === 0 ? (
            <Tile span={2}>
              <span className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-sky-bg text-sky-fg">
                  <CalendarDays size={15} strokeWidth={2.4} />
                </span>
                <span className="text-[15px] font-bold text-ink">Agenda</span>
              </span>
              <p className="py-2 text-[13px] text-ink-faint">Nada por aqui — toque em + pra criar um compromisso.</p>
            </Tile>
          ) : (
            groups.map((group) => (
              <Tile key={group.dayLabel} span={2}>
                <span className="mb-1 inline-block rounded-sm bg-sky-bg px-2 py-1 text-[12px] font-bold uppercase tracking-wide text-sky-fg">
                  {group.dayLabel}
                </span>
                <div className="flex flex-col divide-y divide-line">
                  {group.items.map((event) => (
                    <EventRow key={event.id} event={event} onEdit={() => setSheet({ mode: 'edit', eventId: event.id })} />
                  ))}
                </div>
              </Tile>
            ))
          )}
        </div>
      </div>

      {sheet?.mode === 'create' ? (
        <EventSheet mode="create" groupName={mockGroup.name} onSave={handleCreate} onClose={() => setSheet(null)} />
      ) : null}

      {sheet?.mode === 'edit' && editingEvent ? (
        <EventSheet
          mode="edit"
          groupName={mockGroup.name}
          initial={{
            title: editingEvent.title,
            context: editingEvent.context === 'group' ? 'group' : 'personal',
            dayLabel: editingEvent.dayLabel,
            time: editingEvent.time,
            location: editingEvent.location ?? '',
          }}
          onSave={handleEditSave}
          onDelete={handleDelete}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </HomeLayout>
  )
}
